import React, { Component } from 'react';
import { Container } from '../../Styles';
import PreviousClaims from './PreviousClaims';
import Claim from './Claim';
import TypeCreation from './TypeCreation';
import Messages from '../Messages';

class Actions extends Component {
	render() {
		return (
			<Container>
				<div>
					<Claim />
					<TypeCreation />
				</div>
				<div>
					<PreviousClaims />
					<Messages />
				</div>
			</Container>
		);
	}
}

export default Actions;
