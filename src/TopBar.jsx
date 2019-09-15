import React from 'react';
import colors from './config/colors-config';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

const useStyles = makeStyles(theme => ({
	bar: {
		background: colors.main,
		marginBottom: 20,
		'padding-top': 15,
		'padding-bottom': 15,
		'font-size': 'large',
		'font-family': 'arial'
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
		<AppBar position="static" className={classes.bar}>
			<center>FIN4XPLORER</center>
		</AppBar>
	);
};
// <a href="/"><img src="/header.png" alt="header of finfoo" className={classes.headerImage} />

export default TopBar;
