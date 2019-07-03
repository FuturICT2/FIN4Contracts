import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { DrizzleProvider } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';
import styled from 'styled-components';
import drizzleConfig from './config/drizzle-config';
import menuItems from './config/menu-config';
import TopBar from './TopBar';
import NavigationBar from './NavigationBar';
import { createMuiTheme } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import colors from './config/colors-config';

class App extends Component {
	globalTheme = createMuiTheme({
		palette: {
			primary: {
				light: colors.light,
				main: colors.main,
				dark: colors.main,
				contrastText: colors.light
			},
			secondary: {
				main: colors.dark,
				light: colors.light,
				dark: colors.dark,
				contrastText: colors.light
			}
		}
	});

	render() {
		return (
			<Router>
				<ThemeProvider theme={this.globalTheme}>
					<Fin4Container>
						<TopBar />

						<DrizzleProvider options={drizzleConfig}>
							<LoadingContainer>
								<>
									{/* register menu routes */}
									{menuItems.map((route, i) => (
										<Route exact key={i} render={() => <route.component />} path={route.path} />
									))}
								</>
							</LoadingContainer>
						</DrizzleProvider>
						<Spacer />
					</Fin4Container>

					<NavigationBar />
				</ThemeProvider>
			</Router>
		);
	}
}

const Fin4Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 100%;
`;

const Spacer = styled.div`
	margin-top: 100px;
`;

export default App;
