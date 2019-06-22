import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractForm from '../ContractForm';
import ContractData from '../ContractData';

const NewActionType = () => (
	<>
		<LoadingContainer>
			<ContractForm contract="Fin4Main" method="createNewToken" />
		</LoadingContainer>

		<h2>Children of Fin4BaseToken</h2>

		<LoadingContainer>
			<ContractData contract="Fin4Main" method="getActionNames" />
		</LoadingContainer>
	</>
);

export default NewActionType;
