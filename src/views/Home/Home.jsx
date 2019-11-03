import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import Container from '../../components/Container';
import Messages from '../Messages';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import styled from 'styled-components';
import Currency from '../../components/Currency';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import UsersIcon from '@material-ui/icons/Group';
import CollectionsIcon from '@material-ui/icons/CollectionsBookmark';
import MessageIcon from '@material-ui/icons/Message';
import SendIcon from '@material-ui/icons/Send'; // or Forward

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
			<Messages />
			<Box title={t('your-token-balances')}>
				{Object.keys(props.usersBalances).length === 0 ? (
					<NoTokens>{t('no-tokens-yet')}</NoTokens>
				) : (
					<Table headers={[t('token-name'), t('token-balance')]} colWidths={[85, 15]}>
						{Object.keys(props.usersBalances).map((tokenAddr, index) => {
							let token = props.store.getState().fin4Store.fin4Tokens[tokenAddr];
							return (
								<TableRow
									key={'balance_' + index}
									data={{
										name: (
											<span title={'Description: ' + token.description + '\nUnit:' + token.unit}>
												<Currency symbol={token.symbol} name={token.name} linkTo={'/token/view/' + token.symbol} />
											</span>
										),
										balance: props.usersBalances[tokenAddr]
									}}
								/>
							);
						})}
					</Table>
				)}
			</Box>
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
				{buildIconLabelLink('/users/groups', <UsersIcon />, 'User groups')}
				{buildIconLabelLink('/collections', <CollectionsIcon />, 'Token collections')}
				{buildIconLabelLink('/user/message', <MessageIcon />, 'Message user')}
				{buildIconLabelLink('/user/transfer', <SendIcon />, 'Transfer token')}
			</Box>
		</Container>
	);
}

const RequestEth = styled.div`
	font-family: arial;
	font-size: small;
	color: gray;
`;

const NoTokens = styled.div`
	font-family: arial;
	text-align: center;
	color: silver;
`;

const mapStateToProps = state => {
	return {
		usersBalances: state.fin4Store.usersBalances,
		defaultAccount: state.fin4Store.defaultAccount,
		usersEthBalance: state.fin4Store.usersEthBalance
	};
};

export default drizzleConnect(Home, mapStateToProps);
