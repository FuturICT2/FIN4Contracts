import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractData from '../ContractData';
import Container from '../Styles';
import ContractRetriever from '../ContractRetriever';


const More = () => (
	<Container>
		<LoadingContainer>
			<ContractRetriever/>
		</LoadingContainer>
	</Container>
);

export default More;
