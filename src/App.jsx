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
import store from './middleware';
import { ToastContainer } from 'react-toastify';
import LoadInitialData from './LoadInitialData';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
	render() {
		return (
			<Router>
				<ThemeProvider theme={globalTheme}>
					<Container>
						<ToastContainer />
						<TopBar />
						<DrizzleProvider store={store} options={drizzleConfig}>
							<LoadingContainer>
								<>
									<LoadInitialData />
									{/* register menu routes */}
									{menuItems.map((route, i) => (
										<Route exact key={i} render={() => <route.component />} path={route.path} />
									))}
								</>
							</LoadingContainer>
						</DrizzleProvider>
						<Spacer />
					</Container>
					<NavigationBar />
				</ThemeProvider>
			</Router>
		);
	}
}

const globalTheme = createMuiTheme({
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

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 100%;
`;

const Spacer = styled.div`
	height: 300px;
`;

export default App;
