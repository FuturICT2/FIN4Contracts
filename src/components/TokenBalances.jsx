import React, { useState } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Currency from './Currency';
import Box from './Box';
import Table from './Table';
import TableRow from './TableRow';

function TokenBalances(props) {
	const { t } = useTranslation();

	return (
		<Box title={t('your-token-balances')}>
			{Object.keys(props.usersFin4TokenBalances).length === 0 ? (
				<NoTokens>{t('no-tokens-yet')}</NoTokens>
			) : (
				<Table headers={[t('token-name'), t('token-balance')]} colWidths={[85, 15]}>
					{Object.keys(props.usersFin4TokenBalances).map((tokenAddr, index) => {
						let token = props.fin4Tokens[tokenAddr];
						return (
							<TableRow
								key={'balance_' + index}
								data={{
									name: (
										<span title={'Description: ' + token.description + '\nUnit:' + token.unit}>
											<Currency symbol={token.symbol} name={token.name} linkTo={'/token/view/' + token.symbol} />
										</span>
									),
									balance: props.usersFin4TokenBalances[tokenAddr]
								}}
							/>
						);
					})}
				</Table>
			)}
		</Box>
	);
}

const NoTokens = styled.div`
	font-family: arial;
	text-align: center;
	color: silver;
`;

const mapStateToProps = state => {
	return {
		usersFin4TokenBalances: state.fin4Store.usersFin4TokenBalances,
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(TokenBalances, mapStateToProps);
