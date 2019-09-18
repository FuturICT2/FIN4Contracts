import React from 'react';
import styled from 'styled-components';

const Symbol = styled.span`
	text-transform: uppercase;
	border: 1px solid silver;
	border-radius: 4px;
	padding: 3px 3px 1px 3px;
	color: gray;
`;

const Currency = props => {
	return (
		<>
			<Symbol>{props.symbol}</Symbol>
			{props.name && <span style={{ marginLeft: 5 }}>{props.name}</span>}
		</>
	);
};

export default Currency;
