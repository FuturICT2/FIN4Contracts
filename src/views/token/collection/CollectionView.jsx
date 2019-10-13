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
			<Box title="View collection">
				{collectionViaURL && (
					<>
						{collectionViaURL.identifier}
						<br />
						{collectionViaURL.name}
						<br />
						{collectionViaURL.description}
						<br />
						{collectionViaURL.tokensCount}
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
		collections: state.fin4Store.collections
	};
};

export default drizzleConnect(CollectionView, mapStateToProps);
