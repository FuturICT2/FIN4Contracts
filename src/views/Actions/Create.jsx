import React, { Component } from 'react';
import Container from '../../components/Container';
import TokenCreation from './TokenCreation';
import TokenOverview from './TokenOverview';

class Create extends Component {
	render() {
		return (
			<Container>
				<TokenCreation />
				<TokenOverview />
			</Container>
		);
	}
}

export default Create;
