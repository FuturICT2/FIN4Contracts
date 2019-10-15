import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Box from '../../components/Box';
import PropTypes from 'prop-types';
import Button from '../../components/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import Dropdown from '../../components/Dropdown';
import { Link } from 'react-router-dom';

function CollectionEdit(props, context) {
	const { t } = useTranslation();

	const [collectionViaURL, setCollectionViaURL] = useState(null);
	const tokensToAddArr = useRef(null);
	const tokenToRemove = useRef(null);

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

	const getFormattedTokensInCollection = () => {
		return collectionViaURL.tokens.map(tokenAddr => {
			let token = props.fin4Tokens[tokenAddr];
			return {
				value: token.address,
				label: token.name,
				symbol: token.symbol
			};
		});
	};

	const collectionContainsToken = token => {
		for (let i = 0; i < collectionViaURL.tokens.length; i++) {
			let tokenAddr = collectionViaURL.tokens[i];
			if (tokenAddr === token) {
				return true;
			}
		}
		return false;
	};

	const getFormattedTokensNotYetInCollection = () => {
		return Object.keys(props.fin4Tokens)
			.filter(token => !collectionContainsToken(token.address))
			.map(tokenAddr => {
				let token = props.fin4Tokens[tokenAddr];
				return {
					value: token.address,
					label: token.name,
					symbol: token.symbol
				};
			});
	};

	const addTokens = () => {
		if (!tokensToAddArr.current || tokensToAddArr.current.length === 0) {
			alert('No tokens selected');
			return;
		}

		context.drizzle.contracts.Fin4Collections.methods
			.addTokens(collectionViaURL.collectionId, tokensToAddArr.current)
			.send({
				from: props.store.getState().fin4Store.defaultAccount
			})
			.then(function(result) {
				console.log('Results of submitting: ', result);
			});
	};

	return (
		<>
			{collectionViaURL && (
				<Container>
					<Box>
						<center style={{ fontFamily: 'arial' }}>
							<b style={{ fontSize: 'large' }}>{collectionViaURL.name}</b>
							<br />
							{!collectionViaURL.userIsCreator && !collectionViaURL.userIsAdmin && (
								<>
									<br />
									<span style={{ color: 'red' }}>You don't have editing rights on this collection.</span>
									<br />
								</>
							)}
							<br />
							<Link to={'/collection/' + collectionViaURL.identifier}>View collection</Link>
						</center>
					</Box>
					{collectionViaURL.userIsAdmin && (
						<Box title="Manage tokens">
							<center>
								<Dropdown
									key="add_tokens_select"
									multipleChoice
									onChange={e => (tokensToAddArr.current = e === null ? null : e.map(el => el.value))}
									options={getFormattedTokensNotYetInCollection()}
								/>
								<Button icon={AddIcon} onClick={() => addTokens()}>
									Add tokens
								</Button>
								<br />
								<br />
								<Dropdown
									key="remove_token_select"
									onChange={e => (tokenToRemove.current = e.value)}
									options={getFormattedTokensInCollection()}
								/>
								<Button icon={DeleteIcon} onClick={() => {}}>
									Remove token
								</Button>
							</center>
						</Box>
					)}
					{collectionViaURL.userIsCreator && (
						<Box title="Manage admins">
							<center>
								<Button icon={AddIcon} onClick={() => {}}>
									Add admin
								</Button>
								<br />
								<br />
								<Button icon={DeleteIcon} onClick={() => {}}>
									Remove admin
								</Button>
							</center>
						</Box>
					)}
				</Container>
			)}
		</>
	);
}

CollectionEdit.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		collections: state.fin4Store.collections,
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(CollectionEdit, mapStateToProps);
