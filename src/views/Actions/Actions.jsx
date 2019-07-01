import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import { Container, Box } from '../../Styles';
import PreviousClaims from './PreviousClaims';
import ActionClaim from './ActionClaim';

class Actions extends Component {
	render() {
		return (
			<Container>
				<div>
					<ActionClaim />

					<Box title="Create a New Action Type">
						<ContractForm contractName="Fin4Main" method="createNewToken" />
					</Box>
				</div>

				<PreviousClaims />
			</Container>
		);
	}
}

export default Actions;
