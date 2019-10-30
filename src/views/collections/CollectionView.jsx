import React, { useState, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Box from '../../components/Box';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SortableTokenList from '../../components/SortableTokenList';

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
			<Box>
				{collection && (
					<span style={{ fontFamily: 'arial' }}>
						<center>
							<b style={{ fontSize: 'large' }}>{collection.name}</b>
						</center>
						<br />
						<br />
						<span style={{ color: 'gray' }}>Description:</span> {collection.description}
						<br />
						<br />
						<span style={{ color: 'gray' }}>Number of tokens:</span> {collection.tokens.length}
						{(collection.userIsCreator || collection.userIsAdmin) && (
							<center>
								<br />
								<Link to={'/collection/edit/' + collection.identifier}>Edit collection</Link>
								<br />
							</center>
						)}
					</span>
				)}
			</Box>
			{collection && (
				<Box title="Tokens in collection">
					<SortableTokenList tokens={collection.tokens.map(tokenAddr => props.fin4Tokens[tokenAddr])} />
				</Box>
			)}
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
