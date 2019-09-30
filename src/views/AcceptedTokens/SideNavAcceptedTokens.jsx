import React, { Component } from 'react';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
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
				<SideNav.Nav style={{ 'overflow-y': 'auto' }} defaultSelected="home">
					<NavItem eventKey="home">
						<NavIcon>
							<i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
						</NavIcon>
						<NavText>Home</NavText>
					</NavItem>
					<NavItem eventKey="management">
						<NavIcon>
							<i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
						</NavIcon>
						<NavText>Management</NavText>
					</NavItem>
					<NavItem eventKey="governance">
						<NavIcon>
							<i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
						</NavIcon>
						<NavText>Governance</NavText>
					</NavItem>
				</SideNav.Nav>
			</SideNav>
		);
	}
}

export default SideNavAcceptedTokens;
