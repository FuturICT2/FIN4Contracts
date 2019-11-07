import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import Container from '../../components/Container';
import Box from '../../components/Box';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import UsersIcon from '@material-ui/icons/Group';
import CollectionsIcon from '@material-ui/icons/CollectionsBookmark';
import MessageIcon from '@material-ui/icons/Message';
import SendIcon from '@material-ui/icons/Send'; // or Forward
import EmailIcon from '@material-ui/icons/Email';
import TokenBalances from '../../components/TokenBalances';

let config = null;
try {
	config = require('../../config/deployment-config.json');
} catch (err) {
	console.log('deployment-config.json not found');
}

const axios = require('axios');

const buildIconLabelLink = (link, icon, label) => {
	return (
		<Link to={link} style={{ textDecoration: 'none' }}>
			<div style={{ display: 'flex', alignItems: 'center', paddingLeft: '15px', fontFamily: 'arial' }}>
				{icon}
				&nbsp;&nbsp;{label}
			</div>
			<br />
		</Link>
	);
};

function Home(props) {
	const { t } = useTranslation();
	return (
		<Container>
			<TokenBalances />
			<Box title={t('about-you')}>
				<p style={{ fontFamily: 'arial' }}>
					{t('your-public-address')}
					<br />
					<small>
						{props.defaultAccount === null ? (
							t('info-not-yet-available')
						) : (
							// TODO make network-generic
							<a href={'https://rinkeby.etherscan.io/address/' + props.defaultAccount} target="_blank">
								{props.defaultAccount}
							</a>
						)}
					</small>
				</p>
				<div style={{ fontFamily: 'arial' }}>
					Your balance:{' '}
					{props.usersEthBalance === null
						? t('info-not-yet-available')
						: // TODO dynamic rounding / unit?
						  `${Math.round(props.usersEthBalance * 1000) / 1000} ETH`}
				</div>
				{props.usersEthBalance === 0 && (
					<div style={{ fontFamily: 'arial', color: 'red' }}>
						<small>Without Ether you are limited to read-only interactions.</small>
					</div>
				)}
				{(props.usersEthBalance === null || props.usersEthBalance === 0) && (
					<div style={{ fontFamily: 'arial', color: 'red' }}>
						<small>Are you connected to the correct network?</small>
					</div>
				)}
				{config && config.FAUCET_URL && (
					<>
						<br />
						<a
							href="#"
							onClick={() => {
								let recipient = props.defaultAccount;
								let networkID = window.ethereum.networkVersion;
								let encodedURL = config.FAUCET_URL + '/faucet?recipient=' + recipient + '&networkID=' + networkID;
								console.log('Calling faucet server: ' + encodedURL);
								axios
									.get(encodedURL)
									.then(response => {
										console.log('Successfully called faucet server. Response: ' + response.data);
										alert(response.data);
									})
									.catch(error => {
										console.log('Error calling faucet server', error);
										alert('Failed to request Ether');
									})
									.finally(() => {});
							}}>
							<RequestEth>{t('request-ether')}</RequestEth>
						</a>
					</>
				)}
			</Box>
			<Box title="More" width="250px">
				{/* TODO better title */}
				{buildIconLabelLink('/messages', <EmailIcon />, 'Your messages')}
				{buildIconLabelLink('/user/message', <MessageIcon />, 'Message user')}
				{buildIconLabelLink('/user/transfer', <SendIcon />, 'Transfer token')}
				{buildIconLabelLink('/users/groups', <UsersIcon />, 'User groups')}
				{buildIconLabelLink('/collections', <CollectionsIcon />, 'Token collections')}
			</Box>
		</Container>
	);
}

const RequestEth = styled.div`
	font-family: arial;
	font-size: small;
	color: gray;
`;

const mapStateToProps = state => {
	return {
		usersFin4TokenBalances: state.fin4Store.usersFin4TokenBalances,
		fin4Tokens: state.fin4Store.fin4Tokens,
		defaultAccount: state.fin4Store.defaultAccount,
		usersEthBalance: state.fin4Store.usersEthBalance
	};
};

export default drizzleConnect(Home, mapStateToProps);
