import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Container from './../components/Container';
import Messages from './Actions/Messages';
import Box from './../components/Box';
import Table from './../components/Table';
import TableRow from './../components/TableRow';
import styled from 'styled-components';

class Home extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Container>
				<Messages />
				<Box title="Your token balances">
					{Object.keys(this.props.usersBalances).length === 0 ? (
						<NoTokens>You haven't sucessfully claimed any tokens yet.</NoTokens>
					) : (
						<Table headers={['Name', 'Symbol', 'Balance']}>
							{Object.keys(this.props.usersBalances).map((tokenAddr, index) => {
								let token = this.props.store.getState().fin4Store.fin4Tokens[tokenAddr];
								return (
									<TableRow
										key={'balance_' + index}
										data={{
											name: token.name,
											symbol: token.symbol,
											balance: this.props.usersBalances[tokenAddr]
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
		usersBalances: state.fin4Store.usersBalances
	};
};

export default drizzleConnect(Home, mapStateToProps);
