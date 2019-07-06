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
`;

const Fin4Box = props => {
	const PaperStyle = styled(Paper)`
		${props.maxWidth ? `max-width: ${props.maxWidth}` : 'width: 400px'};
		position: relative;
		padding: 1em;
		margin: 20px;
		overflow: hidden;
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
				<Fin4Box title={props.title} isModal={true} maxWidth="80%">
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
	const size = props.size || 'medium';
	return (
		<Table size={size}>
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
		<TableRow>
			{keys.map((key, index) => {
				return <TableCell key={key}>{values[index]}</TableCell>;
			})}
		</TableRow>
	);
};

const Currency = styled.span`
	text-transform: uppercase;
	border: 1px solid grey;
	border-radius: 4px;
	padding: 0 3px;
`;

export { Fin4Container, Fin4Box, Fin4Modal, Fin4Card, Fin4Table, Fin4TableRow, Currency };
