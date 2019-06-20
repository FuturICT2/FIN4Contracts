import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { ContractData } from 'drizzle-react-components';
import ContractForm from '../ContractForm';

const NewToken = () => (
	<>
		<LoadingContainer>
			<ContractForm contract="Fin4BaseToken" method="createNewToken" />
		</LoadingContainer>

		<h2>Children of Fin4BaseToken</h2>

		<LoadingContainer>
			<ContractData contract="Fin4BaseToken" method="getChildren" />
		</LoadingContainer>
	</>
);

export default NewToken;
