import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { ContractData } from 'drizzle-react-components';

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
			<ContractData contract="Fin4BaseToken" method="getStatusesOfMyClaims" />
		</LoadingContainer>
	</>
);

// TODO How to handle SC-methods that return multiple arrays? Either try getting this to work:
// https://spectrum.chat/trufflesuite/drizzle/how-to-access-arrays-and-maps~1d591c68-42f0-4ca3-9f7f-10468446dfae
// Or write our own element like "MultipleArrayContractData"?
// https://github.com/trufflesuite/drizzle-react-components/blob/develop/src/ContractData.js

export default Claims;
