import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import styled from 'styled-components';
import colors from '../config/colors-config';

const Fin4Box = props => {
	const PaperStyle = styled(Paper)`
		width: ${props.width || '400px'};
		position: relative;
		padding: 1em;
		margin: 20px;
		${props.isModal
			? `box-sizing: border-box;
			max-height: calc(100% - 50px);
			overflow-y: auto;
			box-shadow: 0 0 100px 1px rgba(0,0,0,.7) !important`
			: `opacity: 0.9;`};
		h3 {
			text-align: center;
			background: ${colors.main};
			color: ${colors.light};
			margin: -16px -16px 20px;
			padding: 10px;
			border-radius: 4px 4px 0 0;
		}
	`;

	return (
		<>
			<PaperStyle>
				<Typography variant="h5" component="h3">
					{props.title}
				</Typography>
				{props.children}
			</PaperStyle>
			<div id="collapsing-margin-obstacle" style={{ padding: '1px' }}></div>
		</>
	);
};

export default Fin4Box;
