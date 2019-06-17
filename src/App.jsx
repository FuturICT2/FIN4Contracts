import React, { Component } from 'react';
import { DrizzleProvider } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';

import drizzleConfig from './drizzle-config';
import Account from './Account';
import ClaimSubmission from './ClaimSubmission';
import Claims from './Claims';

class App extends Component {
	render() {
		return (
			<>
				<h1>Finance 4.0</h1>
				<DrizzleProvider options={drizzleConfig}>
					<LoadingContainer>
						<div>
							<Account />
							<ClaimSubmission />
							<Claims />
						</div>
					</LoadingContainer>
				</DrizzleProvider>
			</>
		);
	}
}

export default App;
