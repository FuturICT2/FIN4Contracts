import React from 'react';
import colors from './config/colors-config';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { useTranslation } from 'react-i18next';
import { drizzleConnect } from 'drizzle-react';
import NoNotificationsIcon from '@material-ui/icons/NotificationsNone';
import NewNotificationsIcon from '@material-ui/icons/NotificationsActive';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import { Link } from 'react-router-dom';

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
	alignRight: {
		'text-align': 'right',
		'padding-right': '20px'
	},
	logoText: {
		'text-decoration': 'none',
		color: 'white'
	},
	noWeb3Warning: {
		color: 'yellow',
		'font-family': 'arial'
	},
	newNotification: {
		color: 'yellow'
	}
}));

function TopBar(props) {
	const { t, i18n } = useTranslation();
	const classes = useStyles();

	return (
		<AppBar position="static" className={classes.bar}>
			<center>
				<a className={classes.logoText} href="/">
					FIN4Xplorer
				</a>
			</center>
			<div className={classes.alignRight}>
				<Link to={'/'}>
					{props.messages.filter(msg => !msg.hasBeenActedUpon).length > 0 ? (
						<NewNotificationsIcon className={classes.newNotification} />
					) : (
						<NoNotificationsIcon />
					)}
				</Link>{' '}
				<Link to={'/settings/'}>
					<SettingsIcon />
				</Link>
			</div>
			{props.defaultAccount === null && (
				<center className={classes.noWeb3Warning}>
					<div className={classes.activeLng}>
						Not connected to the Ethereum Rinkeby network. Is MetaMask installed and connected?
					</div>
					<div>
						Get the{' '}
						<a className={classes.noWeb3Warning} href="https://metamask.io/">
							MetaMask extension
						</a>{' '}
						for your desktop browser or try
						<br />{' '}
						<a className={classes.noWeb3Warning} href="https://link.medium.com/zdWtIl7Pq0">
							MetaMask Mobile
						</a>{' '}
						or{' '}
						<a className={classes.noWeb3Warning} href="https://status.im/get/">
							Status
						</a>{' '}
						on your mobile phone. Need help{' '}
						<a
							className={classes.noWeb3Warning}
							href={
								i18n.language === 'en'
									? 'https://fin4xplorer.readthedocs.io/en/latest'
									: 'https://fin4xplorer.readthedocs.io/de/latest/'
							}
							target="_blank">
							getting started
						</a>
						?
					</div>
				</center>
			)}
		</AppBar>
	);
}
// <a href="/"><img src="/header.png" alt="header of finfoo" className={classes.headerImage} />

const mapStateToProps = state => {
	return {
		defaultAccount: state.fin4Store.defaultAccount,
		messages: state.fin4Store.messages
	};
};

export default drizzleConnect(TopBar, mapStateToProps);
