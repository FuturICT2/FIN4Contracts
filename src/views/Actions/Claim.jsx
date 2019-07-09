import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import DropdownActionType from '../../components/DropdownActionType';

class Claim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedActionTypeAddress: null
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
				<DropdownActionType handleChange={this.handleChange.bind(this)} value={this.state.selectedActionTypeAddress} />
				{this.state.selectedActionTypeAddress !== null && (
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
