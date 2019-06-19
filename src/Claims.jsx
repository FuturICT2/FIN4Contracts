import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './drizzle-config';
import ClaimStatuses from './ClaimStatuses';

const Claims = () => (
	<>
		<h2>Old Claims</h2>

		<DrizzleProvider options={drizzleConfig}>
			<LoadingContainer>
				<ClaimStatuses />
			</LoadingContainer>
		</DrizzleProvider>
	</>
);

export default Claims;
