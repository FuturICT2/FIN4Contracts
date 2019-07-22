import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getAllTokenTypes } from '../../components/Contractor';
import { Fin4MainAddress } from '../../config/DeployedAddresses.js';

class Claim extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			tokens: []
		};

		getAllTokenTypes(context.drizzle).then(data => {
			this.setState({ tokens: data });
		});
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
		contracts: state.contracts
	};
};

export default drizzleConnect(Claim, mapStateToProps);
