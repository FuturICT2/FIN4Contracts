import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './drizzle-config';
import { ContractForm } from 'drizzle-react-components';

const ClaimSubmission = () => (
	<>
		<h2>New Claim</h2>

		<DrizzleProvider options={drizzleConfig}>
			<LoadingContainer>
				<ContractForm contract="Fin4BaseToken" method="submitClaim" />
			</LoadingContainer>
		</DrizzleProvider>
	</>
);

export default ClaimSubmission;
