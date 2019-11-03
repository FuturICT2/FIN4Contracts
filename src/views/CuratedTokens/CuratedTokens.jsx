import React, { Component } from 'react';
import SideNavAcceptedTokens from './SideNavAcceptedTokens';
import Management from './Management';
import Listing from './Listing';
import Governance from './Governance';

class CuratedTokens extends Component {
	constructor(props) {
		super(props);

		this.state = { page: 'listing' };

		this.componentholderStyle = {
			position: 'fixed',
			overflowY: 'auto',
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
								return (
									<>
										<br />
										<br />
										<Listing />
									</>
								);
							case 'governance':
								return (
									<>
										<br />
										<br />
										<Governance />
									</>
								);
							case 'management':
								return (
									<>
										<br />
										<br />
										<Management />
									</>
								);
							default:
								return null;
						}
					})()}
				</div>
			</div>
		);
	}
}

export default CuratedTokens;
