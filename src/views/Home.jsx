import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Container from './../components/Container';
import Messages from './Actions/Messages';
import { getContractData } from './../components/Contractor';
import { Fin4MainAddress } from './../config/DeployedAddresses.js';
import Box from './../components/Box';
import Table from './../components/Table';
import TableRow from './../components/TableRow';
import styled from 'styled-components';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			tokenInfosAndBalances: []
		};

		this.updateTokenBalances();
	}

	updateTokenBalances() {
		if (Object.keys(this.props.store.getState().fin4Store.fin4Tokens).length === 0) {
			return;
		}

		var currentAccount = window.web3.currentProvider.selectedAddress;

		getContractData(Fin4MainAddress, 'Fin4Main', 'getFin4TokensWhereUserHasNonzeroBalance')
			.then(tokenAddresses => {
				return tokenAddresses.map(address => {
					let token = this.props.store.getState().fin4Store.fin4Tokens[address];
					//if (token === undefined) { return null; }
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
			//.then(entries => entries.filter(v => v !== null)) // filter out null-entries
			.then(data => {
				this.setState({ tokenInfosAndBalances: data });
			});
	}

	render() {
		return (
			<Container>
				<Messages />
				<Box title="Your token balances">
					{this.state.tokenInfosAndBalances.length === 0 ? (
						<NoTokens>You haven't sucessfully claimed any tokens yet.</NoTokens>
					) : (
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
					)}
				</Box>
			</Container>
		);
	}
}

const NoTokens = styled.div`
	font-family: arial;
	text-align: center;
	color: silver;
`;

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(Home, mapStateToProps);
