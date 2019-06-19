import React from 'react';
import colors from './config/colors-config';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		margin: -8
	},
	bar: {
		background: colors.main
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

const MenuTop = () => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<AppBar position="static" className={classes.bar}>
				<Toolbar>
					<Typography variant="h1" className={classes.title}>
						Finance 4.0
					</Typography>
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default MenuTop;
