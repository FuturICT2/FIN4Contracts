import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Container from './../components/Container';
import Messages from './Actions/Messages';
import { getContractData } from './../components/Contractor';
import { Fin4MainAddress } from './../config/DeployedAddresses.js';
import Box from './../components/Box';
import Table from './../components/Table';
import TableRow from './../components/TableRow';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			tokenInfosAndBalances: []
		};

		var currentAccount = window.web3.currentProvider.selectedAddress;

		getContractData(Fin4MainAddress, 'Fin4Main', 'getChildrenWhereUserHasNonzeroBalance')
			.then(tokenAddresses => {
				return tokenAddresses.map(address => {
					let token = this.props.store.getState().fin4Store.fin4Tokens[address];
					return getContractData(address, 'Fin4Token', 'balanceOf', [currentAccount]).then(balance => {
						return {
							address: token.address,
							name: token.name,
							symbol: token.symbol,
							balance: balance.toString()
						};
					});
				});
			})
			.then(data => Promise.all(data))
			.then(data => {
				this.setState({ tokenInfosAndBalances: data });
			});
	}

	render() {
		return (
			<Container>
				<Messages />
				<Box title="My Token Balances">
					{this.state.tokenInfosAndBalances.length > 0 ? (
						<Table headers={['Name', 'Symbol', 'Balance']}>
							{this.state.tokenInfosAndBalances.map((entry, index) => {
								return (
									<TableRow
										key={index}
										data={{
											name: entry.name,
											symbol: entry.symbol,
											balance: entry.balance
										}}
									/>
								);
							})}
						</Table>
					) : (
						<center>You have no balance on any token yet.</center>
					)}
				</Box>
			</Container>
		);
	}
}

export default drizzleConnect(Home);
