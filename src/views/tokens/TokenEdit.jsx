import React, { useState, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Box from '../../components/Box';
import PropTypes from 'prop-types';
import { findTokenBySymbol } from '../../components/Contractor';
import Currency from '../../components/Currency';

function TokenEdit(props, context) {
	const { t } = useTranslation();

	const [tokenViaURL, setTokenViaURL] = useState(null);

	useEffect(() => {
		let symbol = props.match.params.tokenSymbol;
		if (!tokenViaURL && Object.keys(props.fin4Tokens).length > 0 && symbol) {
			let token = findTokenBySymbol(props, symbol);
			if (token) {
				setTokenViaURL(token);
			}
		}
	});

	return (
		<>
			<Container>
				{tokenViaURL && (
					<>
						<Box>
							<span style={{ fontFamily: 'arial' }}>
								<center>
									<Currency symbol={tokenViaURL.symbol} name={<b>{tokenViaURL.name}</b>} />
								</center>
							</span>
						</Box>
						{tokenViaURL.userIsAdmin && <Box title="Manage proof types"></Box>}
						{tokenViaURL.userIsCreator && <Box title="Manage admins"></Box>}
					</>
				)}
			</Container>
		</>
	);
}

TokenEdit.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(TokenEdit, mapStateToProps);
