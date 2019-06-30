import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import colors from './config/colors-config';
import menuItems from './config/menu-config';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import styled from 'styled-components';

class NavigationBar extends Component {
	constructor(props) {
		super(props);
		// get currently active url... if it doesnt't find it in the menu, it's -1.
		const activeElement = menuItems
			.map(menuItem => menuItem.path)
			.indexOf(window.location.pathname);
		this.state = {
			value: Math.max(0, activeElement)
		};
	}

	render() {
		return (
			<MenuContainer
				value={this.state.value}
				onChange={(event, newValue) => {
					this.setState({ value: newValue });
				}}
				showLabels>
				{menuItems.map((route, i) => {
					return (
						<MenuItem
							key={i}
							component={Link}
							to={route.path}
							label={route.label}
							icon={<route.icon />}
						/>
					);
				})}
			</MenuContainer>
		);
	}
}

const MenuContainer = styled(BottomNavigation)`
	&& {
		background: ${colors.main};
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
`;

const MenuItem = styled(BottomNavigationAction)`
	&& {
		color: ${colors.main2};
		maxwidth: none;
		width: 100%;
	}
`;

export default NavigationBar;
