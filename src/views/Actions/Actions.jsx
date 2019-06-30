import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import { Container, Box } from '../../Styles';
import ActionTypeSelector from './ActionTypeSelector';
import PreviousClaims from './PreviousClaims';

class Actions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedActionTypeAddress: null
		};
	}

	handleActionTypeChange = (event, contractInfoObj) => {
		this.setState({
			selectedActionTypeAddress: event.target.value
		});
	};

	render() {
		return (
			<Container>
				<div>
					<Box title={'Claim an Action'}>
						<ActionTypeSelector key="tsc" onChange={this.handleActionTypeChange} />
						{this.state.selectedActionTypeAddress && (
							<ContractForm contractAddress={this.state.selectedActionTypeAddress} method="submit" />
						)}
					</Box>

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
