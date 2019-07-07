import React, { Component } from 'react';
import Container from '../../components/Container';
import PreviousClaims from './PreviousClaims';
import Claim from './Claim';
import TypeCreation from './TypeCreation';
import Messages from '../Messages';

class Actions extends Component {
	render() {
		return (
			<Container>
				<div style={{ position: 'sticky', top: '20px' }}>
					<Claim />
					<TypeCreation />
				</div>
				<div>
					<Messages />
					<PreviousClaims />
				</div>
			</Container>
		);
	}
}

export default Actions;
