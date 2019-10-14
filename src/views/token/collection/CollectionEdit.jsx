import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../../components/Container';
import Box from '../../../components/Box';
import PropTypes from 'prop-types';
import Button from '../../../components/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import Dropdown from '../../../components/Dropdown';
import { Typography, Divider } from '@material-ui/core';

function CollectionEdit(props, drizzle) {
	const { t } = useTranslation();

	const [collectionViaURL, setCollectionViaURL] = useState(null);

	useEffect(() => {
		let collectionIdentifier = props.match.params.collectionIdentifier;
		if (collectionIdentifier && !collectionViaURL) {
			let collection = props.collections[collectionIdentifier];
			if (collection) {
				setCollectionViaURL(collection);
				// TODO fetch admins
			}
		}
	});

	return (
		<Container>
			<Box title="Edit collection">
				{collectionViaURL && (
					<>
						<center style={{ fontFamily: 'arial' }}>
							<span style={{ color: 'gray' }}>{collectionViaURL.identifier}: </span> <b>{collectionViaURL.name}</b>
						</center>
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
							<center>
								<Divider style={{ margin: '10px 0' }} variant="middle" />
								<Typography color="textSecondary" variant="body1">
									Manage tokens
								</Typography>
								<br />
								<Dropdown
									key="add_tokens_select"
									multipleChoice
									//onChange={}
									//options={}
								/>
								<Button icon={AddIcon} onClick={() => {}}>
									Add tokens
								</Button>
								<br />
								<br />
								<Dropdown
									key="remove_token_select"
									//onChange={}
									//options={}
								/>
								<Button icon={DeleteIcon} onClick={() => {}}>
									Remove token
								</Button>
								<br />
								<br />
							</center>
						)}

						{collectionViaURL.userIsCreator && (
							<center>
								<Divider style={{ margin: '10px 0' }} variant="middle" />
								<Typography color="textSecondary" variant="body1">
									Manage admins
								</Typography>
								<br />
								<Button icon={AddIcon} onClick={() => {}}>
									Add admin
								</Button>
								<br />
								<br />
								<Button icon={DeleteIcon} onClick={() => {}}>
									Remove admin
								</Button>
								<br />
								<br />
							</center>
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
