import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Box from '../../components/Box';
import PropTypes from 'prop-types';
import Button from '../../components/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import Dropdown from '../../components/Dropdown';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Currency from '../../components/Currency';
import Modal from '../../components/Modal';
import TextField from '@material-ui/core/TextField';

function CollectionEdit(props, context) {
	const { t } = useTranslation();

	const [collection, setCollection] = useState(null);
	const tokensToAddArr = useRef(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const groupIdViaModal = useRef(null);

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

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

	const collectionContainsToken = tokenAddr => {
		for (let i = 0; i < collection.tokens.length; i++) {
			if (tokenAddr === collection.tokens[i]) {
				return true;
			}
		}
		return false;
	};

	const getFormattedTokensNotYetInCollection = () => {
		return Object.keys(props.fin4Tokens)
			.filter(tokenAddr => !collectionContainsToken(tokenAddr))
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

	const removeToken = tokenToRemove => {
		context.drizzle.contracts.Fin4Collections.methods
			.removeToken(collection.collectionId, tokenToRemove)
			.send({
				from: props.store.getState().fin4Store.defaultAccount
			})
			.then(function(result) {
				console.log('Results of submitting: ', result);
			});
	};

	const setAdminGroup = () => {
		// TODO
	};

	const removeAdminGroup = () => {
		// TODO
	};

	return (
		<>
			{collection && (
				<Container>
					<Box>
						<center style={{ fontFamily: 'arial' }}>
							Edit <b style={{ fontSize: 'large' }}>{collection.name}</b>
							<br />
							<br />
							<Link to={'/collection/' + collection.identifier}>View collection</Link>
							<br />
							<br />
							{collection.userIsCreator || collection.userIsAdmin ? (
								''
							) : (
								<span style={{ color: 'red' }}>You don't have editing rights on this collection.</span>
							)}
						</center>
					</Box>
					{collection.userIsAdmin && (
						<Box title="Manage tokens">
							<Table headers={['Token', 'Action']} colWidths={[85, 15]}>
								{collection.tokens.map((tokenAddress, index) => {
									let token = props.fin4Tokens[tokenAddress];
									return (
										<TableRow
											key={'token_' + index}
											data={{
												token: <Currency name={token.name} symbol={token.symbol} />,
												actions: (
													<small
														onClick={() => removeToken(tokenAddress)}
														style={{ color: 'blue', textDecoration: 'underline' }}>
														Remove
													</small>
												)
											}}
										/>
									);
								})}
							</Table>
							<br />
							<br />
							<center>
								<br />
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
							</center>
						</Box>
					)}
					{collection.userIsCreator && (
						<Box title="Manage admins">
							<center>
								<br />
								<Modal isOpen={isModalOpen} handleClose={toggleModal} title="Set admin group" width="350px">
									<center>
										<TextField
											key="groupId-field"
											type="number"
											label="Group Id (see overview of groups)"
											onChange={e => (groupIdViaModal.current = e.target.value)}
											style={inputFieldStyle}
										/>
										<br />
										<Button onClick={setAdminGroup}>Submit</Button>
										<br />
									</center>
								</Modal>
								{collection.adminGroupIsSet ? (
									<>
										Admin group Id: <b>{collection.adminGroupId}</b>
										<br />
										<br />
										<Button icon={EditIcon} onClick={toggleModal}>
											Change admin group
										</Button>
										<br />
										<br />
										<Button icon={DeleteIcon} onClick={removeAdminGroup}>
											Remove admin group
										</Button>
									</>
								) : (
									<>
										<Button icon={AddIcon} onClick={toggleModal}>
											Appoint admin group
										</Button>
									</>
								)}
								<br />
								<br />
							</center>
						</Box>
					)}
				</Container>
			)}
		</>
	);
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

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
