import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractForm from '../ContractForm';
import ContractData from '../ContractData';
import Container from '../Styles';
import StringRetriever from '../StringRetriever';

const contractAdresses2ClaimSubmission = displayData => {
	const displayListItems = displayData.map((address, index) => {
		return (
			<li key={index}>
				{address}
			</li>
		);
	});

	return <ul>{displayListItems}</ul>;
}

const ActionClaimSubmission = () => (
	<Container>
		<div>
			<LoadingContainer>
				<ContractForm
					contract="Fin4Main"
					method="submit"
					title="Claim an Action"
					dropdownList={["action"]}
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
				contract="Fin4Main"
				method="getActionsWhereUserHasClaims"
				title="Action types where you have claims"
				callback={contractAdresses2ClaimSubmission}
			//header={["ID", "Approved", "Quantity"]}
			/>
		</LoadingContainer>
	</Container>
);

export default ActionClaimSubmission;
