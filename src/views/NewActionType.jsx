import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractForm from '../ContractForm';
import ContractData from '../ContractData';

const NewActionType = () => (
	<>
		<LoadingContainer>
			<ContractForm contract="Fin4Main" method="createNewToken" title="Create a New Action Type" />
		</LoadingContainer>

		<LoadingContainer>
			<ContractData contract="Fin4Main" method="getActionNames" />
		</LoadingContainer>
	</>
);

export default NewActionType;
