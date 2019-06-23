import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
	card: {
		maxWidth: 245,
		margin: 15
	},
	media: {
		height: 140,
	},
});

const DonorCard = ({ imagePath, title, description, readMore, actionButtonText }) => {
	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardActionArea>
				<CardMedia
					className={classes.media}
					image={imagePath}
					title={title}
				/>
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
		</Card>
	);
}

export default DonorCard;
