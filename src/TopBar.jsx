import React from 'react';
import colors from './config/colors-config';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

const useStyles = makeStyles(theme => ({
	bar: {
		background: colors.main,
		marginBottom: 20,
	},
	headerImage: {
		maxHeight: 50,
		width: 300,
		margin: '10px auto'
	}
}));

const TopBar = () => {
	const classes = useStyles();
	return (
		<a href="/">
			<AppBar position="static" className={classes.bar}>
				<img src="/header.png" alt="header of finfoo" className={classes.headerImage} />
			</AppBar>
		</a>
	);
};

export default TopBar;
