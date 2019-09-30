import React from 'react';
import colors from './config/colors-config';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { useTranslation } from 'react-i18next';

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
	},
	flags: {
		'font-family': 'arial',
		'font-size': 'small',
		'text-align': 'right',
		'padding-right': '20px'
	}
}));

const TopBar = () => {
	const { t, i18n } = useTranslation();
	const classes = useStyles();
	return (
		<AppBar position="static" className={classes.bar}>
			<center>FIN4XPLORER</center>
			<div className={classes.flags}>
				<a
					href="#"
					onClick={() => {
						i18n.changeLanguage('en', () => {
							console.log('Language changed to English');
						});
					}}>
					EN
				</a>
				{' / '}
				<a
					href="#"
					onClick={() => {
						i18n.changeLanguage('de', () => {
							console.log('Language changed to German');
						});
					}}>
					DE
				</a>
			</div>
		</AppBar>
	);
};
// <a href="/"><img src="/header.png" alt="header of finfoo" className={classes.headerImage} />

export default TopBar;
