import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { DrizzleProvider } from 'drizzle-react';
import styled from 'styled-components';
import drizzleConfig from './config/drizzle-config';
import menuItems from './config/menu-config';
import TopBar from './TopBar';
import NavigationBar from './NavigationBar';

class App extends Component {
	render() {
		return (
			<>
				<TopBar />
				<Container>
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
				</Container>
			</>
		);
	}
}

const Container = styled.div`
	padding: 20px 20px 100px;
`

export default App;
