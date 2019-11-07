import React, { useState, useRef, useEffect } from 'react';
import { getContractData, getPollStatus, PollStatus, fetchParameterizerParams } from '../../components/Contractor';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { TextField } from '@material-ui/core';
import VoteModal from './VoteModal';
import RevealModal from './RevealModal';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
const BN = require('bignumber.js');

function Governance(props, context) {
	const { t } = useTranslation();

	const [isProposeReparamOpen, setProposeReparamOpen] = useState(false);
	const [isChallengeReparamOpen, setChallengeReparamOpen] = useState(false);
	const [isVoteModalOpen, setVoteModalOpen] = useState(false);
	const [isRevealModalOpen, setRevealModalOpen] = useState(false);
	const [paramValues, setParamValues] = useState(null);

	const selectedParam = useRef(null);
	const parameterizerAddress = useRef(null);
	const proposeReparamModalValues = useRef({
		value: null
	});

	useEffect(() => {
		fetchParameterizerParams(props.contracts, props, context.drizzle);

		// TODO
	});

	/*
			// get all parameters

			getContractData_deprecated(parameterizerAddress, 'Parameterizer', 'getAll').then(paramValuesBN => {
				let paramValues = {};
				for (var i = 0; i < params.length; i++) {
					let entry = {
						name: params[i].name,
						value: new BN(paramValuesBN[i]).toNumber(),
						statusEnum: ParamActionStatus.DEFAULT,
						status: '-',
						dueDate: '-'
					};
					paramValues[params[i].name] = entry;
				}
				this.setState({ paramValues: paramValues });

				// get proposals

				getContractData_deprecated(parameterizerAddress, 'Parameterizer', 'getProposalKeys').then(proposalKeys => {
					let allPromises = proposalKeys.map(key => {
						return getContractData_deprecated(parameterizerAddress, 'Parameterizer', 'proposals', [key]).then(
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
										param.statusEnum = ParamActionStatus.PROPOSEDREPARAM;
										param.status = 'Proposed value: ' + value;
										return;
									}
									param.statusEnum = ParamActionStatus.DEFAULT;
									param.status = '-';
									param.dueDate = '-';
									return;
								}

								return getPollStatus(challengeID).then(pollStatus => {
									param.dueDate = pollStatus.dueDate;
									switch (pollStatus.inPeriod) {
										case PollStatus.IN_COMMIT_PERIOD:
											param.statusEnum = ParamActionStatus.VOTE;
											param.status = ParamActionStatus.VOTE;
											return;
										case PollStatus.IN_REVEAL_PERIOD:
											param.statusEnum = ParamActionStatus.REVEAL;
											param.status = ParamActionStatus.REVEAL;
											return;
										case PollStatus.PAST_REVEAL_PERIOD:
											return getContractData_deprecated(parameterizerAddress, 'Parameterizer', 'challenges', [
												challengeID
											]).then(
												({
													0: rewardPoolBN,
													1: challenger,
													2: resolved,
													3: stakeBN,
													4: winningTokensBN,
													5: tokenClaimsMapping
												}) => {
													if (resolved) {
														param.statusEnum = ParamActionStatus.DEFAULT;
														param.status = '-';
														param.dueDate = '-';
														return;
													}
													param.statusEnum = ParamActionStatus.UPDATE;
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
*/

	// ---------- ProposeReparam ----------

	const resetProposeReparamModalValues = () => {
		proposeReparamModalValues.current = {
			value: null
		};
	};

	const toggleProposeReparamModal = () => {
		if (isProposeReparamOpen) {
			resetProposeReparamModalValues();
		}
		setProposeReparamOpen(!isProposeReparamOpen);
	};

	const submitProposeReparamModal = () => {
		let name = selectedParam.current.name;
		let value = Number(proposeReparamModalValues.current.value);
		let pMinDeposit = paramValues['pMinDeposit'].value;
		let parameterizerAddr = parameterizerAddress.current;

		toggleProposeReparamModal();
		/*
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
*/
	};
	// ---------- VoteModal ----------

	const toggleVoteModal = () => {
		setVoteModalOpen(!isVoteModalOpen);
	};

	// ---------- RevealModal ----------

	const toggleRevealModal = () => {
		setRevealModalOpen(!isRevealModalOpen);
	};

	// ---------- ChallengeReparam ----------

	const toggleChallengeReparamModal = () => {
		setChallengeReparamOpen(!isChallengeReparamOpen);
	};

	const submitChallengeReparamModal = () => {
		let propID = selectedParam.current.propID;
		let propDeposit = selectedParam.current.propDeposit;
		let parameterizerAddr = parameterizerAddress.current;

		toggleChallengeReparamModal();
		/*
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
*/
	};

	// ----------

	// same as Registry.updateStatus()
	const processProposal = () => {
		/*
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
*/
	};

	return (
		<center>
			<Box title="TCR Parameters" width="900px">
				<Table headers={['Parameter', 'Description', 'Value', 'Actions', 'Status', 'Due Date']}>
					{paramValues !== null &&
						params.map((entry, index) => {
							return (
								<TableRow
									key={index}
									data={{
										parameter: entry.name,
										description: entry.description,
										value: paramValues[entry.name].value,
										actions: (
											<Button
												onClick={() => {
													selectedParam.current = paramValues[entry.name];
													switch (paramValues[entry.name].statusEnum) {
														case Param_Action_Status.DEFAULT:
															toggleProposeReparamModal();
															break;
														case ParamActionStatus.PROPOSEDREPARAM:
															toggleChallengeReparamModal();
															break;
														case ParamActionStatus.VOTE:
															toggleVoteModal();
															break;
														case ParamActionStatus.REVEAL:
															toggleRevealModal();
															break;
														case ParamActionStatus.UPDATE:
															processProposal();
															break;
													}
												}}>
												{paramValues[entry.name].statusEnum}
											</Button>
										),
										status: paramValues[entry.name].status,
										dueDate: paramValues[entry.name].dueDate
									}}
								/>
							);
						})}
				</Table>
			</Box>
			<Modal
				isOpen={isProposeReparamOpen}
				handleClose={toggleProposeReparamModal}
				title="Propose new value"
				width="400px">
				<TextField
					key="propose-value"
					type="number"
					label="Value"
					onChange={e => (proposeReparamModalValues.current.value = e.target.value)}
					style={inputFieldStyle}
				/>
				<Button onClick={submitProposeReparamModal} center="true">
					Submit
				</Button>
				<center>
					<small style={{ fontFamily: 'arial', color: 'gray' }}>
						Upon submitting, two transactions have to be signed: to allow the deposit (
						{paramValues === null ? '?' : paramValues['pMinDeposit'].value}) to be withdrawn from your GOV token balance
						and then to submit the proposed reparameterization.
					</small>
				</center>
			</Modal>
			<Modal
				isOpen={isChallengeReparamOpen}
				handleClose={toggleChallengeReparamModal}
				title="Challenge proposed value"
				width="400px">
				<Button onClick={submitChallengeReparamModal} center="true">
					Submit
				</Button>
				<center>
					<small style={{ fontFamily: 'arial', color: 'gray' }}>
						Upon submitting, two transactions have to be signed: to allow the proposal-deposit (
						{selectedParam.current ? selectedParam.current.propDeposit : '?'}) to be withdrawn from your GOV token
						balance and then to challenge the proposed reparameterization.
					</small>
				</center>
			</Modal>
			<VoteModal
				isOpen={isVoteModalOpen}
				handleClose={toggleVoteModal}
				pollID={selectedParam.current && selectedParam.current.challengeID}
				voteOptionsInfo={
					'Challenge: 1 = vote for the proposed new value, 0 = reject the proposed value and keep the existing one'
				}
			/>
			<RevealModal
				isOpen={isRevealModalOpen}
				handleClose={toggleRevealModal}
				pollID={selectedParam.current && selectedParam.current.challengeID}
			/>
		</center>
	);
}

const ParamActionStatus = {
	DEFAULT: 'Propose',
	PROPOSEDREPARAM: 'Challenge',
	VOTE: 'Vote',
	REVEAL: 'Reveal',
	UPDATE: 'Update'
};

const inputFieldStyle = {
	// copied from ContractForm
	width: '100%',
	marginBottom: '15px'
};

Governance.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		parameterizerParams: state.fin4Store.parameterizerParams
	};
};

export default drizzleConnect(Governance, mapStateToProps);
