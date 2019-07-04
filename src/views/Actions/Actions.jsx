import React, { Component } from 'react';
import { Fin4Container } from '../../Elements';
import PreviousClaims from './PreviousClaims';
import Claim from './Claim';
import TypeCreation from './TypeCreation';
import Messages from '../Messages';

class Actions extends Component {
	render() {
		return (
			<Fin4Container>
				<div style={{ position: 'sticky', top: '20px' }}>
					<Claim />
					<TypeCreation />
				</div>
				<div>
					<Messages />
					<PreviousClaims />
				</div>
			</Fin4Container>
		);
	}
}

export default Actions;
