import React, { useState } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { drizzleConnect } from 'drizzle-react';
import Currency from '../../components/Currency';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';

function TokenOverview(props) {
	const { t, i18n } = useTranslation();

	return (
		<>
			{Object.keys(props.fin4Tokens).length > 0 && (
				<Box title={t('all-tokens')} width="500px">
					<Table headers={[t('token-name'), 'Description', 'Unit', 'Manage']}>
						{Object.keys(props.fin4Tokens).map((addr, index) => {
							let token = props.fin4Tokens[addr];
							let tokenSite = '/token/view/' + token.symbol;
							return (
								<TableRow
									key={'token_' + index}
									data={{
										name: <Currency symbol={token.symbol} name={token.name} />,
										description: (
											<small>
												{token.description.length > 20 ? token.description.substring(0, 20) + '...' : token.description}
											</small>
										),
										unit: <small>{token.unit}</small>,
										action: (
											<Button
												title={'go to ' + tokenSite}
												onClick={() => {
													window.location.href = tokenSite;
												}}>
												More
											</Button>
										)
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
