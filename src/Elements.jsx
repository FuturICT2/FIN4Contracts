import React from 'react';
import { Paper, Typography, Modal, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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
		<Paper style={{ position: 'relative' }}>
			<Typography variant="h5" component="h3">
				{props.title}
			</Typography>
			{props.children}
		</Paper>
	);
};

const Popup = props => {
	const PopupContainer = styled(Container)`
		height: 100%;
		align-items: center;
	`;

	const CloseButton = styled(IconButton)`
		position: absolute !important;
		right: 5px;
		top: 5px;
	`;

	return (
		<Modal open={props.isOpen} onClose={props.handleClose}>
			<PopupContainer>
				<Box title={props.title}>
					<CloseButton onClick={props.handleClose}>
						<CloseIcon fontSize="small" />
					</CloseButton>
					{props.children}
				</Box>
			</PopupContainer>
		</Modal>
	);
};

export { Container, Box, Popup };
