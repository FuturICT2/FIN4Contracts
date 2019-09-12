import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../components/Contractor';
import { Fin4MainAddress } from '../../config/DeployedAddresses';
import { ADD_MULTIPLE_FIN4_TOKENS } from '../../middleware/actionTypes';

class Claim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tokens: []
		};

		// load all Fin4 tokens into the store

		getContractData(Fin4MainAddress, 'Fin4Main', 'getChildren')
			.then(tokens => {
				return tokens.map(address => {
					return getContractData(address, 'Fin4Token', 'getInfo').then(({ 0: name, 1: symbol }) => {
						return {
							name: name,
							symbol: symbol,
							address: address
						};
					});
				});
			})
			.then(promises => Promise.all(promises))
			.then(tokenArr => {
				props.dispatch({
					type: ADD_MULTIPLE_FIN4_TOKENS,
					tokenArr: tokenArr
				});
			});
	}

	componentDidUpdate(prevProps) {
		if (this.props.fin4Tokens === prevProps.fin4Tokens) {
			return;
		}

		// convert them to the Dropdown-suitable format
		let tokens = this.props.fin4Tokens.map(token => {
			return {
				value: token.address,
				label: `[${token.symbol}] ${token.name}`
			};
		});

		this.setState({ tokens: tokens });
	}

	render() {
		return (
			this.state.tokens.length > 0 && (
				<Box title={'Claim an Action'}>
					<ContractForm
						contractAddress={Fin4MainAddress}
						contractName="Fin4Main"
						method="submitClaim"
						labels={['Action type', 'Quantity', 'Date', 'Comment']}
						singleSelectOptions={this.state.tokens}
					/>
				</Box>
			)
		);
	}
}

Claim.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(Claim, mapStateToProps);
