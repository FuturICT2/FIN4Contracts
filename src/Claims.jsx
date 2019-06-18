import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { ContractData } from 'drizzle-react-components';
import ClaimStatuses from './ClaimStatuses';

const Claims = () => (
	<>
		<h2>Old Claims</h2>

		<LoadingContainer>
			<ContractData
				contract="Fin4BaseToken"
				method="getMyTotalNumberOfClaims"
			/>
		</LoadingContainer>

		<h2>Statuses of your claims</h2>

		<LoadingContainer>
			<ClaimStatusesComponent />
		</LoadingContainer>
	</>
);

export default Claims;
