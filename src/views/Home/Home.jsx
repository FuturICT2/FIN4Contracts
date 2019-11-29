import React, { useState } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Container from '../../components/Container';
import Box from '../../components/Box';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import UsersIcon from '@material-ui/icons/Group';
import CollectionsIcon from '@material-ui/icons/CollectionsBookmark';
import MessageIcon from '@material-ui/icons/Message';
import EmailIcon from '@material-ui/icons/Email';
import StarIcon from '@material-ui/icons/Star';
import TokenBalances from '../../components/TokenBalances';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import BuildIcon from '@material-ui/icons/Build';
import AssignmentIcon from '@material-ui/icons/Assignment';
import QRModal from '../../components/QRModal';
import { buildIconLabelLink, TCRactive } from '../../components/utils';

let config = null;
try {
	config = require('../../config/deployment-config.json');
} catch (err) {
	console.log('deployment-config.json not found');
}

const axios = require('axios');

function Home(props) {
	const { t } = useTranslation();

	const [iconIsHovered, setIconHovered] = useState(false);
	const [isQRModalOpen, setQRModalOpen] = useState(false);
	const toggleQRModal = () => {
		setQRModalOpen(!isQRModalOpen);
	};

	return (
		<Container>
			<TokenBalances />
			<Box title="On the blockchain">
				{' '}
				{/*t('about-you')*/}
				<p style={{ fontFamily: 'arial' }}>
					{t('your-public-address')}
					<br />
					<span style={{ fontSize: 'x-small' }}>
						{props.defaultAccount === null ? (
							t('info-not-yet-available')
						) : (
							<>
								{/* TODO make network-generic */}
								<a href={'https://rinkeby.etherscan.io/address/' + props.defaultAccount} target="_blank">
									{props.defaultAccount}
								</a>
								<FontAwesomeIcon
									style={iconIsHovered ? styles.QRiconHover : styles.QRicon}
									icon={faQrcode}
									onClick={toggleQRModal}
									onMouseEnter={() => setIconHovered(true)}
									onMouseLeave={() => setIconHovered(false)}
								/>
							</>
						)}
					</span>
				</p>
				<QRModal isOpen={isQRModalOpen} handleClose={toggleQRModal} publicAddress={props.defaultAccount} />
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
			<Box title="Settings" width="250px">
				{/* TODO better title */}
				{buildIconLabelLink('/about', <InfoIcon />, 'About')}
				{buildIconLabelLink('/settings', <SettingsIcon />, 'System settings')}
				{buildIconLabelLink('/users/groups', <UsersIcon />, 'User groups')}
				{buildIconLabelLink('/collections', <CollectionsIcon />, 'Token collections', true, false)}
			</Box>
			<Box title="Inbox" width="250px">
				{buildIconLabelLink('/messages', <EmailIcon />, 'Your messages')}
				{buildIconLabelLink('/user/message', <MessageIcon />, 'Message user', true, false)}
			</Box>
			<Box title="Token curation" width="250px">
				{buildIconLabelLink('/governance/listing', <StarIcon />, 'Listing')}
				{buildIconLabelLink('/governance/management', <AssignmentIcon />, 'Management')}
				{buildIconLabelLink('/governance/parameters', <BuildIcon />, 'Parameters', true, false)}
			</Box>
		</Container>
	);
}

const styles = {
	QRicon: {
		color: 'black',
		width: '20px',
		height: '20px',
		paddingLeft: '10px'
	},
	QRiconHover: {
		color: 'gray',
		width: '20px',
		height: '20px',
		paddingLeft: '10px'
	}
};

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
