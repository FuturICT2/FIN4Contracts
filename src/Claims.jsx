import React from 'react';
import {
	ContractData
} from 'drizzle-react-components';

const Claims = () => (
	<>
		<h2>Claims submitted by you</h2>
		<ContractData
			contract="Fin4BaseToken"
			method="getMyTotalNumberOfClaims"
		/>
	</>
);

export default Claims;
