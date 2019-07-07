import React from 'react';
import { Typography, Button, Card, CardActionArea, CardActions, CardContent, CardMedia } from '@material-ui/core';
import styled from 'styled-components';

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
export default Fin4Card;
