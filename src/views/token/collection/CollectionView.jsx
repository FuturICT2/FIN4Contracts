import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../../components/Container';
import Box from '../../../components/Box';
import PropTypes from 'prop-types';

function CollectionView(props, drizzle) {
	const { t } = useTranslation();

	const [collectionViaURL, setCollectionViaURL] = useState(null);

	useEffect(() => {
		let collectionIdentifier = props.match.params.collectionIdentifier;
		if (collectionIdentifier && !collectionViaURL) {
			let collection = props.collections[collectionIdentifier];
			if (collection) {
				setCollectionViaURL(collection);
			}
		}
	});

	return (
		<Container>
			<Box title={(collectionViaURL ? collectionViaURL.name : '') + ' collection'}>
				{collectionViaURL && (
					<span style={{ fontFamily: 'arial' }}>
						<center>
							<b style={{ fontSize: 'large' }}>{collectionViaURL.name}</b>
							<br />
							<span style={{ color: 'gray' }}>{collectionViaURL.description}</span>
						</center>
						<br />
						Contains {collectionViaURL.tokens.length} tokens
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
