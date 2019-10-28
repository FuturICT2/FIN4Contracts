import React, { Component } from 'react';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { ReactComponent as HomeButton } from './assets/home-button.svg';
import { ReactComponent as TokenButton } from './assets/token.svg';
import { ReactComponent as GovernanceButton } from './assets/governance.svg';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class SideNavAcceptedTokens extends Component {
	componentDidMount() {}
	render() {
		return (
			<SideNav
				onSelect={selected => {
					this.props.changePage(selected);
				}}>
				<SideNav.Toggle />
				<SideNav.Nav defaultSelected="listing">
					<NavItem eventKey="listing">
						<NavIcon>
							<HomeButton style={{ width: '3.1em', height: 'auto' }} />
						</NavIcon>
						<NavText>Listing</NavText>
					</NavItem>
					<NavItem eventKey="management">
						<NavIcon>
							<TokenButton style={{ width: '3.1em', height: 'auto' }} />
						</NavIcon>
						<NavText>Token Management</NavText>
					</NavItem>
					<NavItem eventKey="governance">
						<NavIcon>
							<GovernanceButton style={{ width: '3.1em', height: 'auto' }} />
						</NavIcon>
						<NavText>Governance</NavText>
					</NavItem>
				</SideNav.Nav>
			</SideNav>
		);
	}
}

export default SideNavAcceptedTokens;
