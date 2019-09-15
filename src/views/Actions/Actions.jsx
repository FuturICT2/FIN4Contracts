import React, { Component } from 'react';
import Container from '../../components/Container';
import PreviousClaims from './PreviousClaims';
import Claim from './Claim';

class Actions extends Component {
	render() {
		return (
			<Container>
				<div>
					<Claim />
				</div>
				<PreviousClaims />
			</Container>
		);
	}
}

export default Actions;
