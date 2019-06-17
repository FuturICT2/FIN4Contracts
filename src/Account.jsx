import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { AccountData } from 'drizzle-react-components';

const Account = ({ accounts }) => (
	<>
		<h2>Active Account</h2>
		<LoadingContainer>
			<AccountData accountIndex="0" units="ether" precision="3" />
		</LoadingContainer>
	</>
);

export default Account;
