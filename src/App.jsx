import React, { Component } from 'react';

import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './drizzle-config';

import Account from './Account';
import ClaimSubmission from './ClaimSubmission';
import Claims from './Claims';

class App extends Component {
	render() {
		return (
			<DrizzleProvider options={drizzleConfig}>
				<>
					<h1>Finance 4.0</h1>
					<Account />
					<ClaimSubmission />
					<Claims />
				</>
			</DrizzleProvider>
		);
	}
}

export default App;
