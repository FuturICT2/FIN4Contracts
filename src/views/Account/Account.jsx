import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { AccountData } from 'drizzle-react-components';
import ClaimStatuses from './ClaimStatuses';

const Account = () => (
	<>
		<h2>Active Account</h2>

		<LoadingContainer>
			<AccountData accountIndex={0} units="ether" precision={3} />
		</LoadingContainer>

		<LoadingContainer>
			<ClaimStatuses />
		</LoadingContainer>
	</>
);

export default Account;
