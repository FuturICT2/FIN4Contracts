import React, { Component } from 'react';
import SideNavAcceptedTokens from './SideNavAcceptedTokens';
import Management from './Management';
import Listing from './Listing';
import Governance from './Governance';

class AcceptedTokens extends Component {
	constructor(props) {
		super(props);

		this.state = { page: 'listing' };

		this.componentholderStyle = {
			position: 'fixed',
			backgroundColor: 'green',
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
							case 'listing':
								return <Listing />;
							case 'governance':
								return <Governance />;
							case 'management':
								return <Management />;
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
