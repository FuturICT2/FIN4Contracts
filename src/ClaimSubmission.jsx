import React from 'react';
import {
	ContractForm
} from 'drizzle-react-components';

const ClaimSubmission = ({ }) => (
	<>
		<h2>Submit Claim</h2>
		<ContractForm contract="Fin4BaseToken" method="submitClaim" />
	</>
);

export default ClaimSubmission;
