import React from 'react';
import styled from 'styled-components';

const Symbol = styled.span`
	text-transform: uppercase;
	border: 1px solid grey;
	border-radius: 4px;
	padding: 0 3px;
`;

const Currency = props => {
	return (
		<>
			<Symbol>{props.symbol}</Symbol>
			{props.name && <span style={{ marginLeft: 15 }}>{props.name}</span>}
		</>
	);
};

export default Currency;
