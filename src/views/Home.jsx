import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { AccountData } from 'drizzle-react-components';
import ActionClaimStatuses from './ActionClaimStatuses';

const Home = () => (
	<>
		<LoadingContainer>
			<AccountData accountIndex={0} units="ether" precision={3} />
		</LoadingContainer>

		<LoadingContainer>
			<ActionClaimStatuses />
		</LoadingContainer>
	</>
);

export default Home;
