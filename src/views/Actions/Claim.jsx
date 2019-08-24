import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import { getAllActionTypes } from '../../components/Contractor';
import { Fin4MainAddress } from '../../config/DeployedAddresses.js';

class Claim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tokens: []
		};

		getAllActionTypes().then(data => {
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

export default Claim;
