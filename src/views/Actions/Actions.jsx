import React, { Component } from 'react';
import { Container } from '../../Styles';
import PreviousClaims from './PreviousClaims';
import Claim from './Claim';
import TypeCreation from './TypeCreation';

class Actions extends Component {
	render() {
		return (
			<Container>
				<div>
					<Claim />
					<TypeCreation />
				</div>

				<PreviousClaims />
			</Container>
		);
	}
}

export default Actions;
