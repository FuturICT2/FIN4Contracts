import React, { Component } from 'react';
import Container from '../../components/Container';
import PreviousClaims from './PreviousClaims';
import Claim from './Claim';
import TypeCreation from './TypeCreation';
import Messages from './Messages';
import styled from 'styled-components';

class Actions extends Component {
	render() {
		return (
			<Container>
				<StickyDiv>
					<Claim />
					<TypeCreation />
				</StickyDiv>
				<div>
					<Messages />
					<PreviousClaims />
				</div>
			</Container>
		);
	}
}

const StickyDiv = styled.div`
	@media (min-width: 944px) {
		top: 20px;
		position: sticky;
	}
`;

export default Actions;
