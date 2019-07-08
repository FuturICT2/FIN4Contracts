import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import Currency from '../../components/Currency';
import ContractData from '../../components/ContractData';
import { Select, MenuItem, InputLabel } from '@material-ui/core';
import ActionTokenSelectMenu from '../../components/ActionTokenSelectMenu';

class Claim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedActionTypeAddress: ''
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
				<ActionTokenSelectMenu
					handleChange={this.handleChange.bind(this)}
					value={this.state.selectedActionTypeAddress}
				/>
				{this.state.selectedActionTypeAddress !== '' && (
					<ContractForm
						contractAddress={this.state.selectedActionTypeAddress}
						method="submit"
						labels={['Quantity', 'Date', 'Comment']}
					/>
				)}
			</Box>
		);
	}
}

export default Claim;
