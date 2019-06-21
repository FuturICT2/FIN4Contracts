import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { DrizzleProvider } from 'drizzle-react';

import drizzleConfig from './config/drizzle-config';
import menuItems from './config/menu-config';
import NavigationBar from './NavigationBar';

class App extends Component {
	render() {
		return (
			<Router>

				<DrizzleProvider options={drizzleConfig}>
					<>
						{/* register menu routes */}
						{menuItems.map((route, i) => (
							<Route
								exact
								key={i}
								render={() => <route.component />}
								path={route.path}
							/>
						))}
					</>
				</DrizzleProvider>

				<NavigationBar />
			</Router>
		);
	}
}

export default App;
