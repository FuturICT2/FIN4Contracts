import React, { useState, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Currency from '../../components/Currency';
import { getContractData, findTokenBySymbol } from '../../components/Contractor';
import PropTypes from 'prop-types';
import { Divider } from '@material-ui/core';
import moment from 'moment';

function TokenDetails(props, context) {
	const { t } = useTranslation();

	const [tokenViaURL, setTokenViaURL] = useState(null);
	const [details, setDetails] = useState(null);

	const fetchDetailedTokenInfo = token => {
		let defaultAccount = props.store.getState().fin4Store.defaultAccount;

		getContractData(
			context.drizzle.contracts.Fin4TokenManagement,
			defaultAccount,
			'getDetailedTokenInfo',
			token.address
		).then(({ 0: requiredProofTypes, 1: claimsCount, 2: usersBalance, 3: totalSupply, 4: tokenCreationTime }) => {
			setDetails({
				requiredProofTypes: requiredProofTypes,
				claimsCount: claimsCount,
				usersBalance: usersBalance,
				totalSupply: totalSupply, // how much of this token has been minted
				tokenCreationTime: moment.unix(tokenCreationTime).calendar()
			});
		});
	};

	const getProofTypesStr = () => {
		let str = '';
		for (let i = 0; i < details.requiredProofTypes.length; i++) {
			str += props.proofTypes[details.requiredProofTypes[i]].label + ', ';
		}
		return str.substring(0, str.length - 2);
	};

	useEffect(() => {
		let symbol = props.match.params.tokenSymbol;
		if (!tokenViaURL && Object.keys(props.fin4Tokens).length > 0 && symbol) {
			// best approach to avoid duplicate and get timing right?
			let token = findTokenBySymbol(props, symbol);
			if (token) {
				setTokenViaURL(token);
				fetchDetailedTokenInfo(token);
			}
		}
	});

	return (
		<Container>
			<Box>
				{!tokenViaURL ? (
					props.match.params.tokenSymbol ? (
						'No token with symbol ' + props.match.params.tokenSymbol + ' found'
					) : (
						'No token-symbol passed via URL'
					)
				) : (
					<span style={{ fontFamily: 'arial' }}>
						<center>
							<Currency symbol={tokenViaURL.symbol} name={<b>{tokenViaURL.name}</b>} />
							<br />
							<span style={{ fontSize: 'x-small' }}>
								<a href={'https://rinkeby.etherscan.io/address/' + tokenViaURL.address} target="_blank">
									{tokenViaURL.address}
								</a>
							</span>
						</center>
						<p>
							<span style={{ color: 'gray' }}>Description:</span> {tokenViaURL.description}
						</p>
						<p>
							<span style={{ color: 'gray' }}>Unit:</span> {tokenViaURL.unit}
						</p>
					</span>
				)}
			</Box>
			{!details ? (
				'Loading details...'
			) : (
				<Box title="Details">
					<span style={{ fontFamily: 'arial' }}>
						<p>
							<span style={{ color: 'gray' }}>Your balance:</span> {details.usersBalance}
						</p>
						<Divider style={{ margin: '10px 0' }} variant="middle" />
						<p>
							<span style={{ color: 'gray' }}>Created at:</span> {details.tokenCreationTime}
						</p>
						<p>
							<span style={{ color: 'gray' }}>Proof types:</span> {getProofTypesStr()}
						</p>
						<p>
							<span style={{ color: 'gray' }}>Total number of claims:</span> {details.claimsCount}
						</p>
						<p>
							<span style={{ color: 'gray' }}>Total supply:</span> {details.totalSupply}
						</p>
					</span>
				</Box>
			)}
		</Container>
	);
}

TokenDetails.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens,
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenDetails, mapStateToProps);
