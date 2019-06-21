import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractForm from '../ContractForm';

const NewActionType = () => (
	<>
		<LoadingContainer>
			<ContractForm contract="Fin4Main" method="createNewToken" />
		</LoadingContainer>
	</>
);

export default NewActionType;
