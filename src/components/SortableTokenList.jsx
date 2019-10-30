import React, { useState, useEffect } from 'react';
import Table from './Table';
import TableRow from './TableRow';
import { drizzleConnect } from 'drizzle-react';
import Currency from './Currency';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function SortableTokenList(props, context) {
	const { t } = useTranslation();

	const [tokens, setTokens] = useState([]);

	useEffect(() => {
		if (tokens.length != props.tokens.length) {
			setTokens(props.tokens);
		}
	});

	return (
		<>
			<Table headers={[t('token-name'), 'Total supply', 'Actions']} colWidths={[65, 20, 15]}>
				{tokens.map((token, index) => {
					return (
						<TableRow
							key={'token_' + index}
							data={{
								name: (
									<span title={'Description: ' + token.description + '\nUnit: ' + token.unit}>
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
		</>
	);
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(SortableTokenList, mapStateToProps);
