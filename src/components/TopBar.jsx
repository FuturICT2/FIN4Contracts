import React, { useState } from 'react';
import colors from '../config/colors-config';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { useTranslation } from 'react-i18next';
import { drizzleConnect } from 'drizzle-react';
import NoNotificationsIcon from '@material-ui/icons/NotificationsNone';
import NewNotificationsIcon from '@material-ui/icons/NotificationsActive';
import RefreshIcon from '@material-ui/icons/Refresh';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import QRModal from './QRModal';

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
	noNotification: {
		color: 'white'
	},
	newNotification: {
		color: 'yellow'
	},
	QRicon: {
		color: 'white',
		width: '20px',
		height: '20px',
		padding: '0 4px 4px 0'
	}
}));

function TopBar(props) {
	const { t, i18n } = useTranslation();
	const classes = useStyles();

	const [isQRModalOpen, setQRModalOpen] = useState(false);
	const toggleQRModal = () => {
		setQRModalOpen(!isQRModalOpen);
	};

	return (
		<>
			<QRModal isOpen={isQRModalOpen} handleClose={toggleQRModal} publicAddress={props.defaultAccount} />
			<AppBar position="static" className={classes.bar}>
				<center>
					<Link to={'/'} className={classes.logoText}>
						<b>FIN4Xplorer</b>
					</Link>
				</center>
				<div className={classes.alignRight}>
					<FontAwesomeIcon className={classes.QRicon} icon={faQrcode} onClick={toggleQRModal} />
					<RefreshIcon onClick={() => window.location.reload()} />
					<Link to={'/messages'}>
						{props.messages.filter(msg => !msg.hasBeenActedUpon).length > 0 ? (
							<NewNotificationsIcon className={classes.newNotification} />
						) : (
							<NoNotificationsIcon className={classes.noNotification} />
						)}
					</Link>{' '}
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
		</>
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
