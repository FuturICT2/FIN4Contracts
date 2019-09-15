import React, { Component } from 'react';
import Container from './../components/Container';
import Messages from './Actions/Messages';

class Home extends Component {
	render() {
		return (
			<Container>
				<Messages />
				Home
			</Container>
		);
	}
}

export default Home;
