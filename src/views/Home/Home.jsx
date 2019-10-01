import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import Container from '../../components/Container';
import Messages from '../Actions/Messages';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import styled from 'styled-components';
import Currency from '../../components/Currency';
import { useTranslation } from 'react-i18next';
const axios = require('axios');

function Home(props) {
	const { t, i18n } = useTranslation();
	return (
		<Container>
			<Messages />
			<Box title={t('your-token-balances')}>
				{Object.keys(props.usersBalances).length === 0 ? (
					<NoTokens>{t('no-tokens-yet')}</NoTokens>
				) : (
					<Table headers={[t('token-name'), t('token-balance')]}>
						{Object.keys(props.usersBalances).map((tokenAddr, index) => {
							let token = props.store.getState().fin4Store.fin4Tokens[tokenAddr];
							return (
								<TableRow
									key={'balance_' + index}
									data={{
										name: (
											<Currency
												symbol={token.symbol}
												name={token.name}
												href={'https://rinkeby.etherscan.io/address/' + tokenAddr}
											/>
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
				<a
					href="#"
					onClick={() => {
						let url = window.location.href;
						// TODO make this URL slicing nicer!
						if (url.endsWith('#')) {
							url = url.substring(0, url.length - 1);
						}
						if (url.endsWith(':3000/')) {
							url = url.substr(0, url.length - 6);
						} else {
							// = http://demo.finfour.net/
							url = url.substring(0, url.length - 1);
						}
						let recipient = props.defaultAccount;
						let networkID = window.ethereum.networkVersion;
						let encodedURL = url + ':4000/faucet?recipient=' + recipient + '&networkID=' + networkID;
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
		defaultAccount: state.fin4Store.defaultAccount
	};
};

export default drizzleConnect(Home, mapStateToProps);
