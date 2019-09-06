import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Button from '../../components/Button';
import { RepTokenAddress, GOVTokenAddress } from '../../config/DeployedAddresses.js';
import { getContractData } from '../../components/Contractor';

class Management extends Component {
	constructor(props) {
		super(props);

		this.state = {
			repTokenBalance: '?',
			govTokenBalance: '?'
		};

		// TODO
	}

	render() {
		return (
			<center>
				<Box title="Token Balances" width="600px">
					<Table headers={['Token', 'Balance', 'Actions']}>
						<TableRow
							key="gov-token"
							data={{
								token: 'Governance Token',
								balance: this.state.govTokenBalance,
								actions: ''
							}}
						/>
						<TableRow
							key="rep-token"
							data={{
								token: 'Reputation Token',
								balance: this.state.repTokenBalance,
								actions: <Button onClick={() => {}}>Convert</Button>
							}}
						/>
					</Table>
				</Box>
			</center>
		);
	}
}

export default drizzleConnect(Management);
