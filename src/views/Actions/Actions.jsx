import React, { Component } from 'react';
import { Container } from '../../Styles';
import PreviousClaims from './PreviousClaims';
import ActionClaim from './ActionClaim';
import ActionTypeCreation from './ActionTypeCreation';

class Actions extends Component {
	render() {
		return (
			<Container>
				<div>
					<ActionClaim />
					<ActionTypeCreation />
				</div>

				<PreviousClaims />
			</Container>
		);
	}
}

export default Actions;
