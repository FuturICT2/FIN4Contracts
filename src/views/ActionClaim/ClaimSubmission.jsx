import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ActionContractForm from './ActionContractForm';

const ClaimSubmission = () => (
	<>
		<h2>New Claim</h2>

		<LoadingContainer>
			<ActionContractForm contract="Fin4BaseToken" method="submitClaim" />
		</LoadingContainer>
	</>
);

export default ClaimSubmission;
