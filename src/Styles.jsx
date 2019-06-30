import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import styled from 'styled-components';
import colors from './config/colors-config';

const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start;

	.MuiPaper-root {
		padding: 1em;
		margin: 25px;
		width: 400px;
		opacity: 0.85;
	}

	h3 {
		text-align: center;
		color: ${colors.main};
		margin-bottom: 25px;
	}
`;

const Box = props => {
	return (
		<Paper>
			<Typography variant="h5" component="h3">
				{props.title}
			</Typography>
			{props.children}
		</Paper>
	);
};

export { Container, Box };
