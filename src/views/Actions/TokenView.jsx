import React, { useState, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Currency from '../../components/Currency';

function TokenView(props) {
	const { t, i18n } = useTranslation();

	const [token, setToken] = useState(null);

	const findTokenBySymbol = symbol => {
		let keys = Object.keys(props.fin4Tokens);
		for (let i = 0; i < keys.length; i++) {
			let token = props.fin4Tokens[keys[i]];
			if (token.symbol === symbol) {
				return token;
			}
		}
		return null;
	};

	useEffect(() => {
		if (!token && Object.keys(props.fin4Tokens).length > 0) {
			// best approach to avoid duplicate and get timing right?
			let token = findTokenBySymbol(props.match.params.tokenSymbol);
			if (token) {
				setToken(token);
			}
		}
	});

	return (
		<Container>
			<Box title="Token View">
				{!token ? (
					'No token with symbol ' + props.match.params.tokenSymbol + ' found'
				) : (
					<>
						<Currency symbol={token.symbol} name={token.name} />
						<p>Description: {token.description}</p>
						<p>Unit: {token.unit}</p>
					</>
				)}
			</Box>
		</Container>
	);
}

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(TokenView, mapStateToProps);
