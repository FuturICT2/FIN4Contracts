import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractForm from '../ContractForm';
import ContractData from '../ContractData';

const ActionClaimSubmission = () => (
	<>
		<LoadingContainer>
			<ContractForm contract="Fin4Claim" method="submit" />
		</LoadingContainer>

		<LoadingContainer>
			<ContractData contract="Fin4Claim" method="getStatuses" />
		</LoadingContainer>
	</>
);

export default ActionClaimSubmission;
