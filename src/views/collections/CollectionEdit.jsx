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

	const [collection, setCollection] = useState(null);
	const tokensToAddArr = useRef(null);
	const tokenToRemove = useRef(null);

	useEffect(() => {
		let collIdentifier = props.match.params.collectionIdentifier;
		if (collIdentifier && !collection) {
			let coll = props.collections[collIdentifier];
			if (coll) {
				setCollection(coll);
				// TODO fetch admins
			}
		}
	});

	const getFormattedTokensInCollection = () => {
		return collection.tokens.map(tokenAddr => {
			let token = props.fin4Tokens[tokenAddr];
			return {
				value: token.address,
				label: token.name,
				symbol: token.symbol
			};
		});
	};

	const collectionContainsToken = token => {
		for (let i = 0; i < collection.tokens.length; i++) {
			let tokenAddr = collection.tokens[i];
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
			.addTokens(collection.collectionId, tokensToAddArr.current)
			.send({
				from: props.store.getState().fin4Store.defaultAccount
			})
			.then(function(result) {
				console.log('Results of submitting: ', result);
			});
	};

	const exportCollectionData = () => {
		alert('TODO');
	};

	return (
		<>
			{collection && (
				<Container>
					<Box>
						<center style={{ fontFamily: 'arial' }}>
							<b style={{ fontSize: 'large' }}>{collection.name}</b>
							<br />
							<br />
							<Link to={'/collection/' + collection.identifier}>View collection</Link>
							<br />
							<br />
							{collection.userIsCreator || collection.userIsAdmin ? (
								<Link
									title="Compiles all data from this token into a CSV file that gets downloaded"
									onClick={() => exportCollectionData()}>
									Export collection data
								</Link>
							) : (
								<span style={{ color: 'red' }}>You don't have editing rights on this collection.</span>
							)}
						</center>
					</Box>
					{collection.userIsAdmin && (
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
					{collection.userIsCreator && (
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
