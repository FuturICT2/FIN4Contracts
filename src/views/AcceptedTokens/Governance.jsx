import React, { Component } from 'react';
import { RegistryAddress } from '../../config/DeployedAddresses.js';
import { getContractData } from '../../components/Contractor';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Button from '../../components/Button';
const BN = require('bignumber.js');

class Governance extends Component {
	constructor(props) {
		super(props);

		this.state = {
			paramValues: []
		};

		getContractData(RegistryAddress, 'Registry', 'parameterizer').then(parameterizerAddress => {
			getContractData(parameterizerAddress, 'Parameterizer', 'getAll').then(paramValuesBN => {
				let paramValues = [];
				for (var i = 0; i < params.length; i++) {
					paramValues.push(new BN(paramValuesBN[i]).toNumber());
				}
				this.setState({ paramValues: paramValues });
			});
		});
	}

	render() {
		return (
			<center>
				<Box title="TCR Parameters" width="600px">
					<Table headers={['Parameter', 'Description', 'Value', 'Actions']}>
						{this.state.paramValues.map((paramValue, index) => {
							return (
								<TableRow
									key={index}
									data={{
										parameter: params[index].name,
										description: params[index].description,
										value: paramValue,
										actions: <Button onClick={() => {}}>Edit</Button>
									}}
								/>
							);
						})}
					</Table>
				</Box>
			</center>
		);
	}
}

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

export default drizzleConnect(Governance);
