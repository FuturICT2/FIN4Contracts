import React, { useState, useEffect } from 'react';
import Box from '../../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../../components/Container';
import Currency from '../../../components/Currency';
import { getContractData, findTokenBySymbol } from '../../../components/Contractor';
import PropTypes from 'prop-types';

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
		).then(({ 0: userIsTokenCreator, 1: requiredProofTypes, 2: claimsCount, 3: usersBalance, 4: totalSupply }) => {
			setDetails({
				userIsTokenCreator: userIsTokenCreator,
				requiredProofTypes: requiredProofTypes,
				claimsCount: claimsCount,
				usersBalance: usersBalance,
				totalSupply: totalSupply // how much of this token has been minted
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
			<Box title="Token Details">
				{!tokenViaURL ? (
					props.match.params.tokenSymbol ? (
						'No token with symbol ' + props.match.params.tokenSymbol + ' found'
					) : (
						'No token-symbol passed via URL'
					)
				) : (
					<>
						<Currency symbol={tokenViaURL.symbol} name={tokenViaURL.name} />
						<p>
							<small>
								<a href={'https://rinkeby.etherscan.io/address/' + tokenViaURL.address}>{tokenViaURL.address}</a>
							</small>
						</p>
						<p>Description: {tokenViaURL.description}</p>
						<p>Unit: {tokenViaURL.unit}</p>
						<hr />
						{!details ? (
							'Loading details...'
						) : (
							<>
								<p>You are the token creator: {details.userIsTokenCreator ? 'yes' : 'no'}</p>
								<p>Proof types: {getProofTypesStr()}</p>
								<p>Total number of claims: {details.claimsCount}</p>
								<p>Your balance: {details.usersBalance}</p>
								<p>Total supply: {details.totalSupply}</p>
							</>
						)}
					</>
				)}
			</Box>
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
