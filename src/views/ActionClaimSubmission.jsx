import React from 'react';
import ContractForm from '../ContractForm';
import Container from '../Styles';
import ContractData from '../ContractData';

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

const ActionClaimSubmission = () => (
	<Container>
		<div>
			<ContractForm
				contract="Fin4Main"
				method="submit"
				title="Claim an Action"
				dropdownList={['action']}
			/>

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
);

export default ActionClaimSubmission;
