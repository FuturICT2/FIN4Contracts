import React, { Component } from 'react';

import MenuTop from './MenuTop';
import MenuBottom from './MenuBottom';
import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './config/drizzle-config';

class App extends Component {
	render() {
		return (
			<DrizzleProvider options={drizzleConfig}>
				<>
					<MenuTop />
					<MenuBottom />
				</>
			</DrizzleProvider>
		);
	}
}

export default App;
