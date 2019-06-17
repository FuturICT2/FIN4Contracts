import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { ContractData } from 'drizzle-react-components';

const Claims = () => (
	<>
		<h2>Claims submitted by you</h2>

		<LoadingContainer>
			<ContractData
				contract="Fin4BaseToken"
				method="getMyTotalNumberOfClaims"
			/>
		</LoadingContainer>
	</>
);

export default Claims;
