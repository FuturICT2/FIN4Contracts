import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import menuItems from '../config/menu-config';
import { createMuiTheme, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import colors from '../config/colors-config';
import styled from 'styled-components';

class NavigationBar extends Component {
	constructor(props) {
		super(props);
		// get currently active url... if it doesnt't find it in the menu, it's -1.
		const activeElement = menuItems.map(menuItem => menuItem.path).indexOf(window.location.pathname);
		this.state = {
			value: Math.max(0, activeElement)
		};
	}

	navBarTheme = createMuiTheme({
		palette: {
			primary: {
				main: colors.dark
			}
		}
	});

	render() {
		return (
			<ThemeProvider theme={this.navBarTheme}>
				<MenuContainer
					value={this.state.value}
					onChange={(event, value) => {
						this.setState({ value });
					}}
					showLabels>
					{menuItems
						.filter(item => item.showInNavBar)
						.map((route, i) => {
							return <MenuItem key={i} component={Link} to={route.path} label={route.label} icon={<route.icon />} />;
						})}
				</MenuContainer>
			</ThemeProvider>
		);
	}
}

const MenuContainer = styled(BottomNavigation)`
	&& {
		background: ${colors.main} !important;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
`;

const MenuItem = styled(BottomNavigationAction)`
	&& {
		color: ${colors.light};
		max-width: none;
		width: 100%;
	}
`;

export default NavigationBar;
