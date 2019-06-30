import React, { Component } from 'react';
import ContractForm from '../ContractForm';
import { Container, Box } from '../Styles';
import ContractData from '../ContractData';
import ActionTypeSelector from '../ActionTypeSelector';

const renderClaimStatusesPerActionContract = data => {
	var tokenAddress = data[0];
	var tokenName = data[1];
	var tokenSymbol = data[2];
	var ids = data[3];
	var states = data[4];
	var quantities = data[5];
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

const actionsWhereUserHasClaims = data => {
	const listItems = data.map((address, index) => {
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
	constructor(props) {
		super(props);
		this.state = {
			selectedActionTypeAddress: null,
			selectedActionTypeName: '',
			selectedActionTypeSymbol: ''
		};
	}

	handleActionTypeChange = (event, contractInfoObj) => {
		this.setState({
			selectedActionTypeAddress: event.target.value,
			selectedActionTypeName: contractInfoObj.name,
			selectedActionTypeSymbol: contractInfoObj.symbol
		});
	};

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
