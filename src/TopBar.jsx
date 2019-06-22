import React from 'react';
import colors from './config/colors-config';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
	bar: {
		background: colors.main,
		marginBottom: 20
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1,
		textAlign: 'center',
		fontSize: '2rem'
	}
}));

const TopBar = () => {
	const classes = useStyles();
	return (
		<AppBar position="static" className={classes.bar}>
			<Toolbar>
				<Typography variant="h1" className={classes.title}>
					FINFOO
					</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default TopBar;
