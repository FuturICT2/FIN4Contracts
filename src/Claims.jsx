import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import ClaimStatuses from './ClaimStatuses';

const Claims = () => (
	<>
		<h2>Old Claims</h2>

		<LoadingContainer>
			<ClaimStatuses />
		</LoadingContainer>
	</>
);

export default Claims;
