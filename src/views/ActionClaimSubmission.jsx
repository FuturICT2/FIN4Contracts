import React, { Component } from 'react';
import ContractForm from '../ContractForm';
import { Container, Box } from '../Styles';
import ContractData from '../ContractData';
import ActionTypeSelector from '../ActionTypeSelector';

const getClaims = data => {
	return data[3].map((id, index) => {
		return {
			id: id,
			tokenName: data[1],
			tokenSymbol: data[2],
			tokenAddress: data[0],
			isApproved: data[4][index],
			quantity: data[5][index]
		};
	});
};

const showClaimByActionTypes = data => {
	const claims = data
		? data.map((address, index) => {
				return (
					<ContractData
						contractAddress={address}
						method="getClaimStatuses"
						key={index}
						callback={data => {
							return getClaims(data).map(claim => {
								return (
									<li key={`${claim.tokenAddress}-${claim.id}`}>
										{claim.tokenName} [{claim.tokenSymbol}] ({claim.quantity}),{' '}
										{!claim.isApproved ? (
											<a
												href={`/proof?tokenAddress=${claim.tokenAddress}&claimId=${claim.id}`}>
												submit proof
											</a>
										) : (
											''
										)}
									</li>
								);
							});
						}}
					/>
				);
		  })
		: [];
	return <ul>{claims}</ul>;
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
						callback={showClaimByActionTypes}
					/>
				</Box>
			</Container>
		);
	}
}

export default ActionClaimSubmission;
