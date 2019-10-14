import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../../components/Container';
import Box from '../../../components/Box';
import PropTypes from 'prop-types';

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
					<span style={{ fontFamily: 'arial' }}>
						<center>
							<b style={{ fontSize: 'large' }}>{collection.name}</b>
							<br />
							<span style={{ color: 'gray' }}>{collection.description}</span>
						</center>
						<br />
						Contains {collection.tokens.length} tokens
					</span>
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
