import React, { Component } from 'react';
import Container from '../../components/Container';
import PreviousClaims from './PreviousClaims';
import Claim from './Claim';
import Messages from './Messages';

// view of the first tab
class Actions extends Component {
	render() {
		return (
			<Container>
				<Messages />
				<div>
					<Claim />
				</div>
				<PreviousClaims />
			</Container>
		);
	}
}

export default Actions;
