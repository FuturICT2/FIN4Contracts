import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractForm from '../ContractForm';
import Container from '../Styles';
import ContractData from '../ContractData';

const renderClaimStatusesPerActionContract = displayData => {
	// TODO
	return displayData;
}

const contractAdresses2ClaimSubmission = displayData => {
	const actionAdrsWhereUserHasClaims = displayData.map((address, index) => {
		return (
			<li key={index}>
				<ContractData
					contractAddress={address}
					method="name"
					callback={renderClaimStatusesPerActionContract}
				/>
			</li>
		);
	});
	return <ul>{actionAdrsWhereUserHasClaims}</ul>;
}

const ActionClaimSubmission = () => (
	<Container>
		<div>
			<LoadingContainer>
				<ContractForm
					contract="Fin4Main"
					method="submit"
					title="Claim an Action"
					dropdownList={['action']}
				/>
			</LoadingContainer>

			<LoadingContainer>
				<ContractForm
					contract="Fin4Main"
					method="createNewToken"
					title="Create a New Action Type"
				/>
			</LoadingContainer>
		</div>

		<LoadingContainer>
			<ContractData
				contractName="Fin4Main"
				method="getActionsWhereUserHasClaims"
				callback={contractAdresses2ClaimSubmission}
			/>
		</LoadingContainer>
	</Container>
);

export default ActionClaimSubmission;
