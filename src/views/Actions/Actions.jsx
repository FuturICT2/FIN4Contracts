import React, { Component } from 'react';
import Container from '../../components/Container';
import PreviousClaims from './PreviousClaims';
import ClaimToken from './ClaimToken';

class Actions extends Component {
	render() {
		return (
			<Container>
				<div>
					<ClaimToken />
				</div>
				<PreviousClaims />
			</Container>
		);
	}
}

export default Actions;
