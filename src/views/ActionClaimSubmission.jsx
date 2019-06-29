import React, { Component } from 'react';
import ContractForm from '../ContractForm';
import Container from '../Styles';
import ContractData from '../ContractData';
import ActionTypeSelector from '../ActionTypeSelector';

const renderClaimStatusesPerActionContract = displayData => {
	var tokenAddress = displayData[0];
	var tokenName = displayData[1];
	var tokenSymbol = displayData[2];
	var ids = displayData[3];
	var states = displayData[4];
	var quantities = displayData[5];
	const listItems = ids.map((id, index) => {
		return (
			<li key={index}>
				claimId: <b>{id}</b>, approved: <b>{states[index] + ""}</b>, quantity: <b>{quantities[index]}</b>
			</li>
		);
	});
	return <div><b>{tokenName}</b> [{tokenSymbol}] {tokenAddress}<ul>{listItems}</ul></div>;
}

const actionsWhereUserHasClaims = displayData => {
	const listItems = displayData.map((address, index) => {
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
	return <ul>{listItems}</ul>;
}

class ActionClaimSubmission extends Component {
	constructor(props, context) {
		super(props);
		this.handleActionTypeChange = this.handleActionTypeChange.bind(this);
		this.state = {
			selectedActionTypeAddress: null,
			selectedActionTypeName: "",
			selectedActionTypeSymbol: ""
        };
    }

	handleActionTypeChange(event, contractInfoObj) {
		this.setState({
			selectedActionTypeAddress: event.target.value,
			selectedActionTypeName: contractInfoObj.name,
			selectedActionTypeSymbol: contractInfoObj.symbol
		});
	}

	render() {
		var claimForm = "";
		if (this.state.selectedActionTypeAddress != null) {
			claimForm = <ContractForm
				contractAddress={this.state.selectedActionTypeAddress}
				method="submit"
				title={"Claim a " + this.state.selectedActionTypeName + "-Action"}
			/>
		  }

		return (
			<Container>
				<div>
					<ActionTypeSelector key="tsc" onChange={this.handleActionTypeChange} />

					{claimForm}					

					<ContractForm
						contractName="Fin4Main"
						method="createNewToken"
						title="Create a New Action Type"
					/>
				</div>

				<ContractData
					contractName="Fin4Main"
					method="getActionsWhereUserHasClaims"
					callback={actionsWhereUserHasClaims}
				/>
			</Container>
		)
	}
}

export default ActionClaimSubmission;
