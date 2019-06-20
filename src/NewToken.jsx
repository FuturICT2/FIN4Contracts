import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './config/drizzle-config';
import { ContractForm } from 'drizzle-react-components';

const NewToken = () => (
	<>
		<h2>New Token</h2>

		<DrizzleProvider options={drizzleConfig}>
			<LoadingContainer></LoadingContainer>
		</DrizzleProvider>
	</>
);

export default NewToken;
