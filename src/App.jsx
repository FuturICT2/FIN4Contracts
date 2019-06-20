import React, { Component } from 'react';

import TopBar from './TopBar';
import menuItems from './config/menu-config';
import NavigationBar from './NavigationBar';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { DrizzleProvider } from 'drizzle-react';
import drizzleConfig from './config/drizzle-config';

class App extends Component {
	render() {
		return (
			<Router>
				<TopBar />

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
