import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Box from '../../components/Box';
import PropTypes from 'prop-types';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Currency from '../../components/Currency';
import { Link } from 'react-router-dom';

function CollectionView(props, drizzle) {
	const { t } = useTranslation();

	const [collection, setCollection] = useState(null);

	useEffect(() => {
		let collectionIdentifier = props.match.params.collectionIdentifier;
		if (collectionIdentifier && !collection) {
			let col = props.collections[collectionIdentifier];
			if (col) {
				setCollection(col);
			}
		}
	});

	return (
		<Container>
			<Box title={(collection ? collection.name : '') + ' collection'}>
				{collection && (
					<>
						<span style={{ fontFamily: 'arial' }}>
							<center>
								<b style={{ fontSize: 'large' }}>{collection.name}</b>
								<br />
								<span style={{ color: 'gray' }}>{collection.description}</span>
							</center>
							<br />
							Contains {collection.tokens.length} tokens:
						</span>
						<Table headers={['Token', 'Actions']} colWidths={[85, 15]}>
							{collection.tokens.map((tokenAddr, index) => {
								let token = props.fin4Tokens[tokenAddr];
								if (!token) {
									// in case fin4Tokens not loaded yet, not sure if that can happen
									return null;
								}
								return (
									<TableRow
										key={'token_' + index}
										data={{
											token: <Currency name={token.name} symbol={token.symbol} />,
											actions: (
												<small style={{ color: 'blue', textDecoration: 'underline' }}>
													<Link to={'/token/details/' + token.symbol}>Details</Link>
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
				)}
			</Box>
		</Container>
	);
}

CollectionView.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens,
		collections: state.fin4Store.collections
	};
};

export default drizzleConnect(CollectionView, mapStateToProps);
