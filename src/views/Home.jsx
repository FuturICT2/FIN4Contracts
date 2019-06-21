import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { AccountData } from 'drizzle-react-components';

const Home = () => (
	<>
		<LoadingContainer>
			<AccountData accountIndex={0} units="ether" precision={3} />
		</LoadingContainer>
	</>
);

export default Home;
