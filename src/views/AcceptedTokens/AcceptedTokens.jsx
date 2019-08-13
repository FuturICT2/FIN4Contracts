import React, { Component } from 'react';
import SideNavAcceptedTokens from './SideNavAcceptedTokens';
import Application from './Application';
import Home from './Home';
import Governance from './Governance';

class AcceptedTokens extends Component {
	constructor(props) {
		super(props);
		this.state = { page: 'Home' };
		this.componentholderStyle = {
			position: 'fixed',
			'background-color': 'green',
			left: '64px',
			top: '70px',
			bottom: '56px',
			right: '0px'
		};
	}

	render() {
		return (
			<div>
				<SideNavAcceptedTokens
					page={this.state.page}
					changePage={page => this.setState({ page })}></SideNavAcceptedTokens>
				<div style={this.componentholderStyle}>
					{(() => {
						switch (this.state.page) {
							case 'home':
								return <Home></Home>;
							case 'governance':
								return <Governance></Governance>;
							case 'application':
								return <Application></Application>;
							default:
								return null;
						}
					})()}
				</div>
			</div>
		);
	}
}

export default AcceptedTokens;
