import React, { Component } from 'react';
import ContractForm from '../ContractForm';
import Container from '../Styles';
import ContractData from '../ContractData';
import ActionTypeSelector from '../ActionTypeSelector';

const renderClaimStatusesPerActionContract = displayData => {
	console.log(displayData);
	return "TODO";
}

const contractAdresses2ClaimSubmission = displayData => {
	const actionAdrsWhereUserHasClaims = displayData.map((address, index) => {
		return (
			<li key={index}>
				<ContractData
					contractAddress={address}
					method="getClaimStatuses"
					callback={renderClaimStatusesPerActionContract}
				/>
			</li>
		);
	});
	return <ul>{actionAdrsWhereUserHasClaims}</ul>;
}



class ActionClaimSubmission extends Component {
	constructor(props, context) {
		super(props);
		this.handleActionTypeChange = this.handleActionTypeChange.bind(this);
		this.state = {
            selectedActionTypeAddress: null
        };
    }

	handleActionTypeChange(event) {
		this.setState({
			selectedActionTypeAddress: event.target.value
		});
	}

	render() {
		var claimForm = "";
		if (this.state.selectedActionTypeAddress != null) {
			claimForm = <ContractForm
				contract="Fin4Main"
				method="submit"
				title="Claim an Action"
			/>
		  }

		return (
			<Container>
				<div>
					<ActionTypeSelector key="tsc" onChange={this.handleActionTypeChange} />

					{claimForm}					

					<ContractForm
						contract="Fin4Main"
						method="createNewToken"
						title="Create a New Action Type"
					/>
				</div>

				<ContractData
					contractName="Fin4Main"
					method="getActionsWhereUserHasClaims"
					callback={contractAdresses2ClaimSubmission}
				/>
			</Container>
		)
	}
}

export default ActionClaimSubmission;
