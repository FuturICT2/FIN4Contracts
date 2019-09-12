import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { loadAllFin4TokensIntoStoreIfNotDoneYet } from '../../components/Contractor';
import { Fin4MainAddress } from '../../config/DeployedAddresses';

class Claim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tokens: []
		};

		// load all Fin4 tokens into the store
		loadAllFin4TokensIntoStoreIfNotDoneYet(props);
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
