import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';

class Claim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedActionTypeAddress: ""
		};
	}

	handleChange = event => {
		this.setState({
			selectedActionTypeAddress: event.target.value
		});
	};

	render() {
		return (
			<Box title={'Claim an Action'}>
				<ContractForm
					contractName="Fin4Main"
					method="submitClaim"
					labels={['Action type', 'Quantity', 'Date', 'Comment']}
				/>
			</Box>
		);
	}
}

export default Claim;
