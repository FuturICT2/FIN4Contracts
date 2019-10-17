import React from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { drizzleConnect } from 'drizzle-react';
import Currency from '../../components/Currency';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function TokenOverview(props) {
	const { t } = useTranslation();

	return (
		<>
			<Box title={t('all-tokens')}>
				<Table headers={[t('token-name'), 'Total supply', 'Actions']} colWidths={[75, 10, 15]}>
					{Object.keys(props.fin4Tokens).map((addr, index) => {
						let token = props.fin4Tokens[addr];
						return (
							<TableRow
								key={'token_' + index}
								data={{
									name: (
										<span title={'Description: ' + token.description + '\nUnit:' + token.unit}>
											<Currency symbol={token.symbol} name={token.name} />
										</span>
									),
									totalSupply: token.totalSupply,
									actions: (
										<small style={{ color: 'blue', textDecoration: 'underline' }}>
											<Link to={'/token/view/' + token.symbol}>View</Link>
											<br />
											{(token.userIsCreator || token.userIsAdmin) && (
												<>
													<Link to={'/token/edit/' + token.symbol}>Edit</Link>
													<br />
												</>
											)}
											<Link to={'/claim/' + token.symbol}>Claim</Link>
										</small>
									)
								}}
							/>
						);
					})}
				</Table>
			</Box>
		</>
	);
}

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(TokenOverview, mapStateToProps);
