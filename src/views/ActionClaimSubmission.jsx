import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractForm from '../ContractForm';
import ContractData from '../ContractData';
import Container from '../Styles';

const ActionClaimSubmission = () => (
	<Container>
		<div>
			<LoadingContainer>
				<ContractForm
					contract="Fin4Main"
					method="submit"
					title="Claim an Action"
					dropdownList={["action", "Fin4Main", "getChildren"]}
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
				header={["Action type address"]} // "ID", "Approved", "Quantity"]}
			/>
		</LoadingContainer>
	</Container>
);

export default ActionClaimSubmission;
