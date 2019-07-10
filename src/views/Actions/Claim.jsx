import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../components/ContractData';

class Claim extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			tokens: []
		};

		getContractData('Fin4Main', 'Fin4Main.json', 'getChildren', [], context.drizzle)
			.then(tokens => {
				return tokens.map(address => {
					return getContractData(address, 'Fin4Token.json', 'getInfo', [], context.drizzle).then(
						({ 0: name, 1: symbol }) => {
							return {
								value: address,
								label: name + ' (' + symbol + ')'
							};
						}
					);
				});
			})
			.then(data => Promise.all(data))
			.then(data => {
				this.setState({ tokens: data });
			});
	}

	render() {
		return (
			this.state.tokens.length > 0 && (
				<Box title={'Claim an Action'}>
					<ContractForm
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
		contracts: state.contracts
	};
};

export default drizzleConnect(Claim, mapStateToProps);
