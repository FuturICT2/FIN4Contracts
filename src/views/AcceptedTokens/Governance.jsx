import React, { Component } from 'react';
import { RegistryAddress, GOVTokenAddress } from '../../config/DeployedAddresses.js';
import {
	getCurrentAccount,
	getContractData,
	getContract,
	getPollStatus,
	PollStatus
} from '../../components/Contractor';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { TextField } from '@material-ui/core';
import VoteModal from './VoteModal';
import RevealModal from './RevealModal';
const BN = require('bignumber.js');

class Governance extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isProposeReparamOpen: false,
			isChallengeReparamOpen: false,
			isVoteModalOpen: false,
			isRevealModalOpen: false,
			paramValues: null
		};

		this.selectedParam = null;
		this.parameterizerAddress = null;
		this.resetProposeReparamModalValues();

		getContractData(RegistryAddress, 'Registry', 'parameterizer').then(parameterizerAddress => {
			this.parameterizerAddress = parameterizerAddress;

			// get all parameters

			getContractData(parameterizerAddress, 'Parameterizer', 'getAll').then(paramValuesBN => {
				let paramValues = {};
				for (var i = 0; i < params.length; i++) {
					let entry = {
						name: params[i].name,
						value: new BN(paramValuesBN[i]).toNumber(),
						statusEnum: Param_Action_Status.DEFAULT,
						status: '-',
						dueDate: '-'
					};
					paramValues[params[i].name] = entry;
				}
				this.setState({ paramValues: paramValues });

				// get proposals

				getContractData(parameterizerAddress, 'Parameterizer', 'getProposalKeys').then(proposalKeys => {
					let allPromises = proposalKeys.map(key => {
						return getContractData(parameterizerAddress, 'Parameterizer', 'proposals', [key]).then(
							({ 0: appExpiryBN, 1: challengeIDBN, 2: depositBN, 3: name, 4: owner, 5: processByBN, 6: valueBN }) => {
								if (!this.state.paramValues[name]) {
									// is this correct? TODO
									return;
								}
								let param = this.state.paramValues[name];
								param.propID = key;
								param.propDeposit = new BN(depositBN).toNumber();

								let appExpiry = new BN(appExpiryBN).toNumber() * 1000;
								param.dueDate = new Date(appExpiry).toLocaleString('de-CH-1996');

								let nowTimestamp = Date.now();
								let inAppTime = appExpiry - nowTimestamp > 0;
								let value = new BN(valueBN).toNumber();

								let challengeID = new BN(challengeIDBN).toNumber();
								param.challengeID = challengeID;

								if (challengeID === 0) {
									if (inAppTime) {
										param.statusEnum = Param_Action_Status.PROPOSEDREPARAM;
										param.status = 'Proposed value: ' + value;
										return;
									}
									param.statusEnum = Param_Action_Status.DEFAULT;
									param.status = '-';
									param.dueDate = '-';
									return;
								}

								return getPollStatus(challengeID).then(pollStatus => {
									param.dueDate = pollStatus.dueDate;
									switch (pollStatus.inPeriod) {
										case PollStatus.IN_COMMIT_PERIOD:
											param.statusEnum = Param_Action_Status.VOTE;
											param.status = Param_Action_Status.VOTE;
											return;
										case PollStatus.IN_REVEAL_PERIOD:
											param.statusEnum = Param_Action_Status.REVEAL;
											param.status = Param_Action_Status.REVEAL;
											return;
										case PollStatus.PAST_REVEAL_PERIOD:
											return getContractData(parameterizerAddress, 'Parameterizer', 'challenges', [challengeID]).then(
												({
													0: rewardPoolBN,
													1: challenger,
													2: resolved,
													3: stakeBN,
													4: winningTokensBN,
													5: tokenClaimsMapping
												}) => {
													if (resolved) {
														param.statusEnum = Param_Action_Status.DEFAULT;
														param.status = '-';
														param.dueDate = '-';
														return;
													}
													param.statusEnum = Param_Action_Status.UPDATE;
													param.status = 'Update pending';
													param.dueDate = '-';
												}
											);
									}
								});
							}
						);
					});
					Promise.all(allPromises).then(results => {
						// a more elegant way to trigger a state-update?
						this.setState({ paramValues: this.state.paramValues });
					});
				});
			});
		});
	}

	// ---------- ProposeReparam ----------

	resetProposeReparamModalValues() {
		this.proposeReparamModalValues = {
			value: null
		};
	}

	toggleProposeReparamModal = () => {
		if (this.state.isProposeReparamOpen) {
			this.resetProposeReparamModalValues();
		}
		this.setState({ isProposeReparamOpen: !this.state.isProposeReparamOpen });
	};

	submitProposeReparamModal = () => {
		let name = this.selectedParam.name;
		let value = Number(this.proposeReparamModalValues.value);
		let pMinDeposit = this.state.paramValues['pMinDeposit'].value;
		let parameterizerAddr = this.parameterizerAddress;

		this.toggleProposeReparamModal();

		getContract(GOVTokenAddress, 'GOV')
			.then(function(instance) {
				return instance.approve(parameterizerAddr, pMinDeposit, {
					from: getCurrentAccount()
				});
			})
			.then(function(result) {
				console.log('GOV.approve Result: ', result);
				getContract(parameterizerAddr, 'Parameterizer')
					.then(function(instance) {
						return instance.proposeReparameterization(name, value, {
							from: getCurrentAccount()
						});
					})
					.then(function(result) {
						console.log('Parameterizer.proposeReparameterization Result: ', result);
					})
					.catch(function(err) {
						console.log('Parameterizer.proposeReparameterization Error: ', err.message);
						alert(err.message);
					});
			})
			.catch(function(err) {
				console.log('GOV.approve Error: ', err.message);
				alert(err.message);
			});
	};
	// ---------- VoteModal ----------

	toggleVoteModal = () => {
		this.setState({ isVoteModalOpen: !this.state.isVoteModalOpen });
	};

	// ---------- RevealModal ----------

	toggleRevealModal = () => {
		this.setState({ isRevealModalOpen: !this.state.isRevealModalOpen });
	};

	// ---------- ChallengeReparam ----------

	toggleChallengeReparamModal = () => {
		this.setState({ isChallengeReparamOpen: !this.state.isChallengeReparamOpen });
	};

	submitChallengeReparamModal = () => {
		let propID = this.selectedParam.propID;
		let propDeposit = this.selectedParam.propDeposit;
		let parameterizerAddr = this.parameterizerAddress;

		this.toggleChallengeReparamModal();

		getContract(GOVTokenAddress, 'GOV')
			.then(function(instance) {
				return instance.approve(parameterizerAddr, propDeposit, {
					from: getCurrentAccount()
				});
			})
			.then(function(result) {
				console.log('GOV.approve Result: ', result);
				getContract(parameterizerAddr, 'Parameterizer')
					.then(function(instance) {
						return instance.challengeReparameterization(propID, {
							from: getCurrentAccount()
						});
					})
					.then(function(result) {
						console.log('Parameterizer.challengeReparameterization Result: ', result);
					})
					.catch(function(err) {
						console.log('Parameterizer.challengeReparameterization Error: ', err.message);
						alert(err.message);
					});
			})
			.catch(function(err) {
				console.log('GOV.approve Error: ', err.message);
				alert(err.message);
			});
	};

	// ----------

	// same as Registry.updateStatus()
	processProposal() {
		let propID = this.selectedParam.propID;
		getContract(this.parameterizerAddress, 'Parameterizer')
			.then(function(instance) {
				return instance.processProposal(propID, {
					from: getCurrentAccount()
				});
			})
			.then(function(result) {
				console.log('Parameterizer.processProposal Result: ', result);
			})
			.catch(function(err) {
				console.log('Parameterizer.processProposal Error: ', err.message);
				alert(err.message);
			});
	}

	render() {
		return (
			<center>
				<Box title="TCR Parameters" width="900px">
					<Table headers={['Parameter', 'Description', 'Value', 'Actions', 'Status', 'Due Date']}>
						{this.state.paramValues !== null &&
							params.map((entry, index) => {
								return (
									<TableRow
										key={index}
										data={{
											parameter: entry.name,
											description: entry.description,
											value: this.state.paramValues[entry.name].value,
											actions: (
												<Button
													onClick={() => {
														this.selectedParam = this.state.paramValues[entry.name];
														switch (this.state.paramValues[entry.name].statusEnum) {
															case Param_Action_Status.DEFAULT:
																this.toggleProposeReparamModal();
																break;
															case Param_Action_Status.PROPOSEDREPARAM:
																this.toggleChallengeReparamModal();
																break;
															case Param_Action_Status.VOTE:
																this.toggleVoteModal();
																break;
															case Param_Action_Status.REVEAL:
																this.toggleRevealModal();
																break;
															case Param_Action_Status.UPDATE:
																this.processProposal();
																break;
														}
													}}>
													{this.state.paramValues[entry.name].statusEnum}
												</Button>
											),
											status: this.state.paramValues[entry.name].status,
											dueDate: this.state.paramValues[entry.name].dueDate
										}}
									/>
								);
							})}
					</Table>
				</Box>
				<Modal
					isOpen={this.state.isProposeReparamOpen}
					handleClose={this.toggleProposeReparamModal}
					title="Propose new value"
					width="400px">
					<TextField
						key="propose-value"
						type="number"
						label="Value"
						onChange={e => (this.proposeReparamModalValues.value = e.target.value)}
						style={inputFieldStyle}
					/>
					<Button onClick={this.submitProposeReparamModal} center="true">
						Submit
					</Button>
					<center>
						<small style={{ color: 'gray' }}>
							Upon submitting, two transactions have to be signed: to allow the deposit (
							{this.state.paramValues === null ? '?' : this.state.paramValues['pMinDeposit'].value}) to be withdrawn
							from your GOV token balance and then to submit the proposed reparameterization.
						</small>
					</center>
				</Modal>
				<Modal
					isOpen={this.state.isChallengeReparamOpen}
					handleClose={this.toggleChallengeReparamModal}
					title="Challenge proposed value"
					width="400px">
					<Button onClick={this.submitChallengeReparamModal} center="true">
						Submit
					</Button>
					<center>
						<small style={{ color: 'gray' }}>
							Upon submitting, two transactions have to be signed: to allow the proposal-deposit (
							{this.selectedParam ? this.selectedParam.propDeposit : '?'}) to be withdrawn from your GOV token balance
							and then to challenge the proposed reparameterization.
						</small>
					</center>
				</Modal>
				<VoteModal
					isOpen={this.state.isVoteModalOpen}
					handleClose={this.toggleVoteModal}
					pollID={this.selectedParam && this.selectedParam.challengeID}
					voteOptionsInfo={
						'Challenge: 1 = vote for the proposed new value, 0 = reject the proposed value and keep the existing one'
					}
				/>
				<RevealModal
					isOpen={this.state.isRevealModalOpen}
					handleClose={this.toggleRevealModal}
					pollID={this.selectedParam && this.selectedParam.challengeID}
				/>
			</center>
		);
	}
}

const Param_Action_Status = {
	DEFAULT: 'Propose',
	PROPOSEDREPARAM: 'Challenge',
	VOTE: 'Vote',
	REVEAL: 'Reveal',
	UPDATE: 'Update'
};

const params = [
	{
		name: 'minDeposit',
		description: 'minimum deposit for listing to be whitelisted'
	},
	{
		name: 'pMinDeposit',
		description: 'minimum deposit to propose a reparameterization'
	},
	{
		name: 'applyStageLen',
		description: 'period over which applicants wait to be whitelisted'
	},
	{
		name: 'pApplyStageLen',
		description: 'period over which reparmeterization proposals wait to be processed'
	},
	{
		name: 'commitStageLen',
		description: 'length of commit period for voting'
	},
	{
		name: 'pCommitStageLen',
		description: 'length of commit period for voting in parameterizer'
	},
	{
		name: 'revealStageLen',
		description: 'length of reveal period for voting'
	},
	{
		name: 'pRevealStageLen',
		description: 'length of reveal period for voting in parameterizer'
	},
	{
		name: 'dispensationPct',
		description: "percentage of losing party's deposit distributed to winning party"
	},
	{
		name: 'pDispensationPct',
		description: "percentage of losing party's deposit distributed to winning party in parameterizer"
	},
	{
		name: 'voteQuorum',
		description: 'type of majority out of 100 necessary for candidate success'
	},
	{
		name: 'pVoteQuorum',
		description: 'type of majority out of 100 necessary for proposal success in parameterizer'
	},
	{
		name: 'exitTimeDelay',
		description: 'minimum length of time user has to wait to exit the registry'
	},
	{
		name: 'exitPeriodLen',
		description: 'maximum length of time user can wait to exit the registry'
	},
	{
		name: 'reviewTax',
		description: 'fee for the reviewers'
	},
	{
		name: 'pminReputation',
		description: 'minimum amount of needed reputation for users to be able to participate in governance'
	}
];

const inputFieldStyle = {
	// copied from ContractForm
	width: '100%',
	marginBottom: '15px'
};

export default drizzleConnect(Governance);
