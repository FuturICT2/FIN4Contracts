import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './drizzle-config';
import { AccountData } from 'drizzle-react-components';

const Account = () => (
	<>
		<h2>Active Account</h2>

		<DrizzleProvider options={drizzleConfig}>
			<LoadingContainer>
				<AccountData accountIndex={0} units="ether" precision={3} />
			</LoadingContainer>
		</DrizzleProvider>
	</>
);

export default Account;
