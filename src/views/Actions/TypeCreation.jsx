import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import { Box } from '../../Styles';

class ActionTypeCreation extends Component {
	render() {
		return (
			<Box title="Create a New Action Type">
				<ContractForm contractName="Fin4Main" method="createNewToken" />
			</Box>
		);
	}
}

export default ActionTypeCreation;
