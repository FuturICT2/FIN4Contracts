import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { DrizzleProvider } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';
import styled from 'styled-components';
import drizzleConfig from './config/drizzle-config';
import menuItems from './config/menu-config';
import TopBar from './TopBar';
import NavigationBar from './NavigationBar';

class App extends Component {
	render() {
		return (
			<Router>
				<Container>
					<TopBar />

					<DrizzleProvider options={drizzleConfig}>
						<LoadingContainer>
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
						</LoadingContainer>
					</DrizzleProvider>
					<Spacer />
				</Container>

				<NavigationBar />
			</Router>
		);
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 100%;
`

const Spacer = styled.div`
	margin-top: 100px;
`

export default App;
