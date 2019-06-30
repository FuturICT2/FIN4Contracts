import React, { Component } from 'react';
import ContractForm from '../ContractForm';
import { Container, Box } from '../Styles';
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
		var linkToProofSubmission = '';
		if (states[index] === false) {
			var url =
				'/proof?tokenAddress=' + tokenAddress + '&claimId=' + ids[index];
			linkToProofSubmission = <a href={url}>submit proof</a>;
		}
		return (
			<li key={index}>
				claimId: <b>{id}</b>, approved: <b>{states[index] + ''}</b>, quantity:{' '}
				<b>{quantities[index]}</b> {linkToProofSubmission}
			</li>
		);
	});
	return (
		<div>
			<b>{tokenName}</b> [{tokenSymbol}] {tokenAddress}
			<ul>{listItems}</ul>
		</div>
	);
};

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
};

class ActionClaimSubmission extends Component {
	constructor(props, context) {
		super(props);
		this.handleActionTypeChange = this.handleActionTypeChange.bind(this);
		this.state = {
			selectedActionTypeAddress: null,
			selectedActionTypeName: '',
			selectedActionTypeSymbol: ''
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
		return (
			<Container>
				<div>
					<Box title={'Claim an Action'}>
						<ActionTypeSelector
							key="tsc"
							onChange={this.handleActionTypeChange}
						/>
						{this.state.selectedActionTypeAddress && (
							<ContractForm
								contractAddress={this.state.selectedActionTypeAddress}
								method="submit"
							/>
						)}
					</Box>

					<Box title="Create a New Action Type">
						<ContractForm contractName="Fin4Main" method="createNewToken" />
					</Box>
				</div>

				<Box title="My Previous Claims">
					<ContractData
						contractName="Fin4Main"
						method="getActionsWhereUserHasClaims"
						callback={actionsWhereUserHasClaims}
					/>
				</Box>
			</Container>
		);
	}
}

export default ActionClaimSubmission;
