import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ContractData from '../ContractData';

const Home = () => (
	<LoadingContainer>
		<ContractData contract="Fin4Claim" method="getStatuses" />
	</LoadingContainer>
);

export default Home;
