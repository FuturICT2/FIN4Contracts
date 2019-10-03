import React, { useState } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { drizzleConnect } from 'drizzle-react';
import Currency from '../../components/Currency';
import { useTranslation } from 'react-i18next';

function TokenOverview(props) {
	const { t, i18n } = useTranslation();

	return (
		<>
			{Object.keys(props.fin4Tokens).length > 0 && (
				<Box title={t('all-tokens')}>
					<Table headers={[t('token-name')]}>
						{Object.keys(props.fin4Tokens).map((addr, index) => {
							let token = props.fin4Tokens[addr];
							return (
								<TableRow
									key={'token_' + index}
									data={{
										name: <Currency symbol={token.symbol} name={token.name} />
										// edit: 'TODO'
									}}
								/>
							);
						})}
					</Table>
				</Box>
			)}
		</>
	);
}

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(TokenOverview, mapStateToProps);
