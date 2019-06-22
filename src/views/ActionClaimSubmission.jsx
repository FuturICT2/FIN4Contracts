import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractForm from '../ContractForm';
import ContractData from '../ContractData';
import Container from '../Styles';

const ActionClaimSubmission = () => (
	<Container>
		<LoadingContainer>
			<ContractForm 
				contract="Fin4Claim" 
				method="submit" 
				title="Claim an action" 
				dropdownList={["action", "Fin4Main", "getActionNames"]} 
			/>
		</LoadingContainer>

		<LoadingContainer>
			<ContractData
				contract="Fin4Claim"
				method="getStatuses"
				title="Your Previous Claims"
				header={["ID", "Approved"]}
			/>
		</LoadingContainer>
	</Container>
);

export default ActionClaimSubmission;
