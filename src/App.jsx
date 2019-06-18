import React, { Component } from 'react';
import MenuTop from './MenuTop';
import MenuBottom from './MenuBottom';

import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './drizzle-config';
import Account from './Account';
import ClaimSubmission from './ClaimSubmission';
import Claims from './Claims';

class App extends Component {
	render() {
		return (
			<>
				<MenuTop />
				<DrizzleProvider options={drizzleConfig}>
					<>
						<Account />
						<ClaimSubmission />
						<Claims />
					</>
				</DrizzleProvider>
				<MenuBottom />
			</>
		);
	}
}

export default App;
