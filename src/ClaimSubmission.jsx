import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { ContractForm } from 'drizzle-react-components';

const ClaimSubmission = () => (
	<>
		<h2>Submit Claim</h2>
		<LoadingContainer>
			<ContractForm contract="Fin4BaseToken" method="submitClaim" />
		</LoadingContainer>
	</>
);

export default ClaimSubmission;
