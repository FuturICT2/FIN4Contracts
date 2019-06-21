import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { AccountData } from 'drizzle-react-components';
import ContractData from '../ContractData';

const Home = () => (
	<>
		<LoadingContainer>
			<AccountData accountIndex={0} units="ether" precision={3} />
		</LoadingContainer>

		<LoadingContainer>
			<ContractData contract="Fin4BaseToken" method="getStatusesOfMyClaims" />
		</LoadingContainer>
	</>
);

export default Home;
