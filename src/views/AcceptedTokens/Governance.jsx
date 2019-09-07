import React, { Component } from 'react';
import { RegistryAddress, GOVTokenAddress } from '../../config/DeployedAddresses.js';
import { getContractData, getContract } from '../../components/Contractor';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { TextField } from '@material-ui/core';
const BN = require('bignumber.js');

class Governance extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isProposeReparamOpen: false,
			paramValues: null
		};

		this.parameterizerAddress = null;
		this.resetProposeReparamModalValues();

		getContractData(RegistryAddress, 'Registry', 'parameterizer').then(parameterizerAddress => {
			this.parameterizerAddress = parameterizerAddress;

			// get all parameters

			getContractData(parameterizerAddress, 'Parameterizer', 'getAll').then(paramValuesBN => {
				let paramValues = {};
				for (var i = 0; i < params.length; i++) {
					let entry = {
						value: new BN(paramValuesBN[i]).toNumber(),
						status: Param_Action_Status.DEFAULT
					};
					paramValues[params[i].name] = entry;
				}
				this.setState({ paramValues: paramValues });

				// get proposals

				getContractData(parameterizerAddress, 'Parameterizer', 'getProposalKeys').then(proposalKeys => {
					let allPromises = proposalKeys.map(key => {
						return getContractData(parameterizerAddress, 'Parameterizer', 'proposals', [key]).then(
							({ 0: appExpiryBN, 1: challengeIDBN, 2: depositBN, 3: name, 4: owner, 5: processByBN, 6: valueBN }) => {
								// TODO
							}
						);
					});
					Promise.all(allPromises).then(results => {
						// TODO
					});
				});
			});
		});
	}

	// ---------- ProposeReparam ----------

	resetProposeReparamModalValues() {
		this.proposeReparamModalValues = {
			name: null,
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
		let currentAccount = window.web3.currentProvider.selectedAddress;
		let name = this.proposeReparamModalValues.name;
		let value = Number(this.proposeReparamModalValues.value);
		let pMinDeposit = this.state.paramValues['pMinDeposit'].value;
		let self = this;

		this.toggleProposeReparamModal();

		getContract(GOVTokenAddress, 'GOV')
			.then(function(instance) {
				return instance.approve(self.parameterizerAddress, pMinDeposit, {
					from: currentAccount
				});
			})
			.then(function(result) {
				console.log('GOV.approve Result: ', result);
				getContract(self.parameterizerAddress, 'Parameterizer')
					.then(function(instance) {
						return instance.proposeReparameterization(name, value, {
							from: currentAccount
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

	render() {
		return (
			<center>
				<Box title="TCR Parameters" width="800px">
					<Table headers={['Parameter', 'Description', 'Value', 'Status', 'Actions']}>
						{this.state.paramValues !== null &&
							params.map((entry, index) => {
								return (
									<TableRow
										key={index}
										data={{
											parameter: entry.name,
											description: entry.description,
											value: this.state.paramValues[entry.name].value,
											status: this.state.paramValues[entry.name].status,
											actions: (
												<Button
													onClick={() => {
														this.proposeReparamModalValues.name = params[index].name;
														this.toggleProposeReparamModal();
													}}>
													Propose Value
												</Button>
											)
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
					<Button onClick={this.submitProposeReparamModal} center>
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
			</center>
		);
	}
}

const Param_Action_Status = {
	DEFAULT: '-',
	PROPOSEDREPARAM: 'Proposed reparameterization',
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
