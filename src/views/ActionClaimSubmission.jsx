import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractForm from '../ContractForm';

const ActionClaimSubmission = () => (
	<LoadingContainer>
		<ContractForm contract="Fin4BaseToken" method="submitClaim" />
	</LoadingContainer>
);

export default ActionClaimSubmission;
