import React, { Component } from 'react';
import Menu from './Menu';

import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './drizzle-config';
import Account from './Account';
import ClaimSubmission from './ClaimSubmission';
import Claims from './Claims';

class App extends Component {
	render() {
		return (
			<>
				<Menu />
				<DrizzleProvider options={drizzleConfig}>
					<>
						<Account />
						<ClaimSubmission />
						<Claims />
					</>
				</DrizzleProvider>
			</>
		);
	}
}

export default App;
