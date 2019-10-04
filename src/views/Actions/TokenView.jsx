import React, { useState, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Currency from '../../components/Currency';
import { getContractData } from '../../components/Contractor';

function TokenView(props) {
	const { t, i18n } = useTranslation();

	const [token, setToken] = useState(null);
	const [details, setDetails] = useState(null);

	const findTokenBySymbol = symb => {
		let symbol = symb.toUpperCase();
		let keys = Object.keys(props.fin4Tokens);
		for (let i = 0; i < keys.length; i++) {
			let token = props.fin4Tokens[keys[i]];
			if (token.symbol === symbol) {
				return token;
			}
		}
		return null;
	};

	const fetchDetailedTokenInfo = tok => {
		getContractData(props, tok.address, 'Fin4Token', 'getDetailedInfo').then(
			({ 0: userIsTokenCreator, 1: requiredProofTypes, 2: claimsCount, 3: usersBalance, 4: totalSupply }) => {
				setDetails({
					userIsTokenCreator: userIsTokenCreator,
					requiredProofTypes: requiredProofTypes,
					claimsCount: claimsCount,
					usersBalance: usersBalance,
					totalSupply: totalSupply // how much of this token has been minted
				});
			}
		);
	};

	const getProofTypesStr = () => {
		let str = '';
		for (let i = 0; i < details.requiredProofTypes.length; i++) {
			str += props.proofTypes[details.requiredProofTypes[i]].label + ', ';
		}
		return str.substring(0, str.length - 2);
	};

	useEffect(() => {
		if (!token && Object.keys(props.fin4Tokens).length > 0) {
			// best approach to avoid duplicate and get timing right?
			let tok = findTokenBySymbol(props.match.params.tokenSymbol);
			if (tok) {
				setToken(tok);
				fetchDetailedTokenInfo(tok);
			}
		}
	});

	return (
		<Container>
			<Box title="Token View">
				{!token ? (
					props.match.params.tokenSymbol ? (
						'No token with symbol ' + props.match.params.tokenSymbol + ' found'
					) : (
						'No token-symbol passed via URL'
					)
				) : (
					<>
						<Currency symbol={token.symbol} name={token.name} />
						<p>
							<small>
								<a href={'https://rinkeby.etherscan.io/address/' + token.address}>{token.address}</a>
							</small>
						</p>
						<p>Description: {token.description}</p>
						<p>Unit: {token.unit}</p>
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

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens,
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenView, mapStateToProps);
