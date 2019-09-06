import React, { Component } from 'react';
import { RegistryAddress } from '../../config/DeployedAddresses.js';
import { getContractData } from '../../components/Contractor';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Button from '../../components/Button';
const BN = require('bignumber.js');

const paramNames = [
	'minDeposit',
	'pMinDeposit',
	'applyStageLen',
	'pApplyStageLen',
	'commitStageLen',
	'pCommitStageLen',
	'revealStageLen',
	'pRevealStageLen',
	'dispensationPct',
	'pDispensationPct',
	'voteQuorum',
	'pVoteQuorum',
	'exitTimeDelay',
	'exitPeriodLen',
	'reviewTax',
	'pminReputation'
];

class Governance extends Component {
	constructor(props) {
		super(props);

		this.state = {
			paramValues: []
		};

		getContractData(RegistryAddress, 'Registry', 'parameterizer').then(parameterizerAddress => {
			getContractData(parameterizerAddress, 'Parameterizer', 'getAll').then(paramValuesBN => {
				let paramValues = [];
				for (var i = 0; i < paramNames.length; i++) {
					paramValues.push(new BN(paramValuesBN[i]).toNumber());
				}
				this.setState({ paramValues: paramValues });
			});
		});
	}

	render() {
		return (
			<center>
				<Box title="TCR Parameters" width="800px">
					<Table headers={['Parameter', 'Value', 'Actions']}>
						{this.state.paramValues.map((paramValue, index) => {
							return (
								<TableRow
									key={index}
									data={{
										parameter: paramNames[index],
										value: paramValue,
										actions: <Button onClick={() => {}}>Action</Button>
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

export default drizzleConnect(Governance);
