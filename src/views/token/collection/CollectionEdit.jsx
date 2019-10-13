import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../../components/Container';
import Box from '../../../components/Box';
import PropTypes from 'prop-types';
import Button from '../../../components/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteForever';

function CollectionEdit(props, drizzle) {
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
			<Box title="Edit collection">
				{collectionViaURL && (
					<>
						<div>
							{collectionViaURL.identifier}: {collectionViaURL.name}
						</div>
						<br />
						<br />

						{!collectionViaURL.userIsCreator && !collectionViaURL.userIsAdmin && (
							<>
								<span style={{ color: 'red' }}>You don't have editing rights on this collection.</span>
								<br />
								<br />
							</>
						)}

						{collectionViaURL.userIsAdmin && (
							<>
								<Button icon={AddIcon} onClick={() => {}}>
									Add token(s)
								</Button>
								<Button icon={DeleteIcon} onClick={() => {}}>
									Remove token
								</Button>
								<br />
								<br />
							</>
						)}

						{collectionViaURL.userIsCreator && (
							<>
								<Button icon={AddIcon} onClick={() => {}}>
									Add admin
								</Button>
								<Button icon={DeleteIcon} onClick={() => {}}>
									Remove admin
								</Button>
								<br />
								<br />
							</>
						)}
					</>
				)}
			</Box>
		</Container>
	);
}

CollectionEdit.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		collections: state.fin4Store.collections
	};
};

export default drizzleConnect(CollectionEdit, mapStateToProps);
