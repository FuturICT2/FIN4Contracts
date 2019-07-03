import React from 'react';
import {
	Paper,
	Typography,
	Modal,
	Button,
	IconButton,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import styled from 'styled-components';
import colors from './config/colors-config';

const Fin4Container = styled.div`
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

const Fin4Box = props => {
	return (
		<Paper style={{ position: 'relative' }}>
			<Typography variant="h5" component="h3">
				{props.title}
			</Typography>
			{props.children}
		</Paper>
	);
};

const Fin4Card = ({ imagePath, title, description, readMore, actionButtonText }) => {
	const CardStyle = styled(Card)`
		max-width: 245px;
		margin: 15px;
	`;

	const Image = styled(CardMedia)`
		height: 140px;
	`;

	return (
		<CardStyle>
			<CardActionArea>
				<Image image={imagePath} title={title} />
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{title}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{description}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button size="small" color="secondary">
					{actionButtonText}
				</Button>
				<a href={readMore} rel="noopener noreferrer" target="_blank">
					<Button size="small" color="primary">
						Learn More
					</Button>
				</a>
			</CardActions>
		</CardStyle>
	);
};

const Fin4Modal = props => {
	const Fin4ModalContainer = styled(Fin4Container)`
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
			<Fin4ModalContainer>
				<Fin4Box title={props.title}>
					<CloseButton onClick={props.handleClose}>
						<CloseIcon fontSize="small" />
					</CloseButton>
					{props.children}
				</Fin4Box>
			</Fin4ModalContainer>
		</Modal>
	);
};

const Fin4Table = props => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					{props.headers.map((key, index) => {
						return <TableCell key={index}>{key}</TableCell>;
					})}
				</TableRow>
			</TableHead>
			<TableBody>{props.children}</TableBody>
		</Table>
	);
};

const Fin4TableRow = props => {
	const keys = Object.keys(props.data);
	const values = Object.values(props.data);
	return (
		<TableRow key={props.index}>
			{keys.map((key, index) => {
				return <TableCell key={key}>{values[index]}</TableCell>;
			})}
		</TableRow>
	);
};

export { Fin4Container, Fin4Box, Fin4Modal, Fin4Card, Fin4Table, Fin4TableRow };
