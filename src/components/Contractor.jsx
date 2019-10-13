import Web3 from 'web3';
const BN = require('bignumber.js');
const web3 = new Web3(window.ethereum);

// --------------------- HELPER METHODS ---------------------

const getContractData = (contract, defaultAccount, method, ...methodArgs) => {
	if (methodArgs.length === 0) {
		return contract.methods[method]().call({
			from: defaultAccount
		});
	} else {
		return contract.methods[method](...methodArgs).call({
			from: defaultAccount
		});
	}
};

const addContract = (props, drizzle, name, address, events, tokenNameSuffixed) => {
	const json = require('../build/contracts/' + name + '.json');
	let contractConfig = {
		contractName: tokenNameSuffixed ? tokenNameSuffixed : name,
		web3Contract: new web3.eth.Contract(json.abi, address)
	};
	props.dispatch({ type: 'ADD_CONTRACT', drizzle, contractConfig, events, web3 });
};

const findTokenBySymbol = (props, symb) => {
	let symbol = symb.toUpperCase();
	let keys = Object.keys(props.fin4Tokens);
	for (let i = 0; i < keys.length; i++) {
		let token = props.fin4Tokens[keys[i]];
		if (token.symbol === symbol) {
			return token;
		}
	}
	return null;
};

const isValidPublicAddress = addr => {
	try {
		let address = web3.utils.toChecksumAddress(addr);
		return true;
	} catch (e) {
		console.error(e.message);
		return false;
	}
};

const getFin4TokensFormattedForSelectOptions = fin4Tokens => {
	return Object.keys(fin4Tokens).map(addr => {
		let token = fin4Tokens[addr];
		return {
			value: token.address,
			label: token.name,
			symbol: token.symbol
		};
	});
};

const fetchMessage = (Fin4MessagesContract, defaultAccount, messageId) => {
	return getContractData(Fin4MessagesContract, defaultAccount, 'getMyMessage', messageId).then(
		({
			0: messageId,
			1: messageType,
			2: sender,
			3: senderStr,
			4: message,
			5: hasBeenActedUpon,
			6: attachment,
			7: pendingApprovalId
		}) => {
			return {
				messageId: messageId.toString(),
				messageType: messageType.toString(),
				sender: sender,
				proofTypeName: senderStr,
				message: message,
				hasBeenActedUpon: hasBeenActedUpon,
				attachment: attachment,
				pendingApprovalId: pendingApprovalId
			};
		}
	);
};

// --------------------- LOAD INITIAL DATA ---------------------

const addSatelliteContracts = (props, Fin4MainContract, drizzle) => {
	let defaultAccount = props.store.getState().fin4Store.defaultAccount;
	getContractData(Fin4MainContract, defaultAccount, 'getFin4MessagesAddress').then(Fin4MessagesAddress => {
		addContract(props, drizzle, 'Fin4Messages', Fin4MessagesAddress, ['NewMessage', 'MessageMarkedAsRead']);
	});
	getContractData(Fin4MainContract, defaultAccount, 'getFin4ClaimingAddress').then(Fin4ClaimingAddress => {
		addContract(props, drizzle, 'Fin4Claiming', Fin4ClaimingAddress, [
			'ClaimSubmitted',
			'ClaimApproved',
			'ProofApproved'
		]);
	});
	getContractData(Fin4MainContract, defaultAccount, 'getFin4CollectionsAddress').then(Fin4CollectionsAddress => {
		addContract(props, drizzle, 'Fin4Collections', Fin4CollectionsAddress, []);
	});
};

const fetchMessages = (props, Fin4MessagesContract) => {
	let defaultAccount = props.store.getState().fin4Store.defaultAccount;
	getContractData(Fin4MessagesContract, defaultAccount, 'getMyMessagesCount')
		.then(data => {
			var messageCount = Number(data);
			var messageIndices = [];
			for (var i = 0; i < messageCount; i++) {
				messageIndices.push(i);
			}
			return messageIndices.map(index => {
				return fetchMessage(Fin4MessagesContract, defaultAccount, index);
			});
		})
		.then(messages => Promise.all(messages))
		.then(messages => {
			props.dispatch({
				type: 'ADD_MULTIPLE_MESSAGES',
				messagesArr: messages
			});
		});
};

const fetchAllTokens = (props, Fin4MainContract, callback) => {
	let defaultAccount = props.store.getState().fin4Store.defaultAccount;
	getContractData(Fin4MainContract, defaultAccount, 'getAllFin4Tokens')
		.then(tokens => {
			return tokens.map(tokenAddr => {
				return getContractData(Fin4MainContract, defaultAccount, 'getTokenInfo', tokenAddr).then(
					({ 0: name, 1: symbol, 2: description, 3: unit }) => {
						return {
							address: tokenAddr,
							name: name,
							symbol: symbol,
							description: description,
							unit: unit
						};
					}
				);
			});
		})
		.then(promises => Promise.all(promises))
		.then(tokenArr => {
			props.dispatch({
				type: 'ADD_MULTIPLE_FIN4_TOKENS',
				tokenArr: tokenArr
			});
			callback();
		});
};

const fetchUsersNonzeroTokenBalances = (props, Fin4MainContract) => {
	let defaultAccount = props.store.getState().fin4Store.defaultAccount;
	getContractData(Fin4MainContract, defaultAccount, 'getMyNonzeroTokenBalances').then(
		({ 0: nonzeroBalanceTokens, 1: balancesBN }) => {
			if (nonzeroBalanceTokens.length === 0) {
				return;
			}
			props.dispatch({
				type: 'UPDATE_MULTIPLE_BALANCES',
				tokenAddresses: nonzeroBalanceTokens,
				balances: balancesBN.map(balanceBN => new BN(balanceBN).toNumber())
			});
		}
	);
};

const fetchAndAddAllProofTypes = (props, Fin4MainContract, drizzle) => {
	let defaultAccount = props.store.getState().fin4Store.defaultAccount;
	getContractData(Fin4MainContract, defaultAccount, 'getProofTypes')
		.then(proofTypeAddresses => {
			return proofTypeAddresses.map(proofTypeAddress => {
				return getContractData(Fin4MainContract, defaultAccount, 'getProofTypeInfo', proofTypeAddress).then(
					({ 0: name, 1: description, 2: parameterForActionTypeCreatorToSetEncoded }) => {
						// add Contract objects to drizzle
						addContract(props, drizzle, name, proofTypeAddress, []);
						return {
							value: proofTypeAddress,
							label: name,
							description: description,
							paramsEncoded: parameterForActionTypeCreatorToSetEncoded,
							paramValues: {} // TODO remove this weird placeholder to be used in ContractForm
						};
					}
				);
			});
		})
		.then(data => Promise.all(data))
		.then(data => {
			props.dispatch({
				type: 'ADD_MULTIPLE_PROOF_TYPES',
				proofTypesArr: data
			});
		});
};

const fetchCurrentUsersClaims = (props, Fin4ClaimingContract) => {
	let defaultAccount = props.store.getState().fin4Store.defaultAccount;
	getContractData(Fin4ClaimingContract, defaultAccount, 'getActionsWhereUserHasClaims')
		.then(tokenAddresses => {
			return tokenAddresses.map(tokenAddr => {
				return getContractData(Fin4ClaimingContract, defaultAccount, 'getMyClaimIdsOnThisToken', tokenAddr).then(
					claimIds => {
						return claimIds.map(claimId => {
							return getContractData(
								Fin4ClaimingContract,
								defaultAccount,
								'getClaimOnThisToken',
								tokenAddr,
								claimId
							).then(
								({
									0: claimer,
									1: isApproved,
									2: quantityBN,
									3: dateBN,
									4: comment,
									5: requiredProofTypes,
									6: proofStatusesBool
								}) => {
									let proofStatusesObj = {};
									for (let i = 0; i < requiredProofTypes.length; i++) {
										proofStatusesObj[requiredProofTypes[i]] = proofStatusesBool[i];
									}
									return {
										id: tokenAddr + '_' + claimId, // pseudoId
										token: tokenAddr,
										claimId: claimId,
										claimer: claimer,
										isApproved: isApproved,
										quantity: new BN(quantityBN).toNumber(),
										date: new BN(dateBN).toNumber(),
										comment: comment,
										proofStatuses: proofStatusesObj
									};
								}
							);
						});
					}
				);
			});
		})
		.then(promises => Promise.all(promises))
		.then(data => data.flat())
		.then(promises => Promise.all(promises))
		.then(claimArr => {
			props.dispatch({
				type: 'ADD_MULTIPLE_CLAIMS',
				claimArr: claimArr
			});
		});
};

const fetchCollectionsInfo = (props, Fin4CollectionsContract) => {
	let defaultAccount = props.store.getState().fin4Store.defaultAccount;
	getContractData(Fin4CollectionsContract, defaultAccount, 'getCollectionsCount')
		.then(collectionsCount => {
			return Array(new BN(collectionsCount).toNumber())
				.fill()
				.map((x, i) => i)
				.map(collectionId => {
					return getContractData(Fin4CollectionsContract, defaultAccount, 'getCollection', collectionId).then(
						({
							0: userIsCreator,
							1: userIsAdmin,
							2: tokens,
							3: name,
							4: identifier,
							5: description,
							6: color,
							7: logoURL
						}) => {
							return {
								userIsCreator: userIsCreator,
								userIsAdmin: userIsAdmin,
								tokens: tokens,
								name: name,
								identifier: identifier,
								description: description,
								color: color,
								logoURL: logoURL
							};
						}
					);
				});
		})
		.then(promises => Promise.all(promises))
		.then(data => {
			props.dispatch({
				type: 'ADD_MULTIPLE_COLLECTIONS',
				collectionsArr: data
			});
		});
};

// -------------------------------------------------------------

export {
	getContractData,
	addContract,
	addSatelliteContracts,
	fetchMessage,
	fetchMessages,
	fetchAllTokens,
	fetchUsersNonzeroTokenBalances,
	fetchCurrentUsersClaims,
	fetchAndAddAllProofTypes,
	findTokenBySymbol,
	isValidPublicAddress,
	getFin4TokensFormattedForSelectOptions,
	fetchCollectionsInfo
};

/*
// DEPRECATED
const getAllActionTypes = () => {
	return getContractData_deprecated(Fin4MainAddress, 'Fin4Main', 'getAllFin4Tokens')
		.then(tokens => {
			return tokens.map(address => {
				return getContractData_deprecated(address, 'Fin4Token', 'getInfo').then(({ 0: name, 1: symbol, 2: description }) => {
					return {
						value: address,
						label: `[${symbol}] ${name}`
					};
				});
			});
		})
		.then(data => Promise.all(data));
};

const getPollStatus = pollID => {
	// pollID is also called challengeID in Registry.sol
	return getContractData_deprecated('PLCRVotingAddress-DUMMY', 'PLCRVoting', 'pollMap', [pollID]).then(
		({ 0: commitEndDateBN, 1: revealEndDateBN, 2: voteQuorum, 3: votesFor, 4: votesAgainst }) => {
			let commitEndDate = new BN(commitEndDateBN).toNumber() * 1000;
			let revealEndDate = new BN(revealEndDateBN).toNumber() * 1000;
			let nowTimestamp = Date.now();

			if (commitEndDate - nowTimestamp > 0) {
				return {
					inPeriod: PollStatus.IN_COMMIT_PERIOD,
					dueDate: new Date(commitEndDate).toLocaleString('de-CH-1996') // choose locale automatically?
				};
			}

			if (revealEndDate - nowTimestamp > 0) {
				return {
					inPeriod: PollStatus.IN_REVEAL_PERIOD,
					dueDate: new Date(revealEndDate).toLocaleString('de-CH-1996')
				};
			}

			return {
				inPeriod: PollStatus.PAST_REVEAL_PERIOD,
				dueDate: ''
			};
		}
	);
};

const getTCRAddresses = props => {
	getContractData_deprecated(Fin4MainAddress, 'Fin4Main', 'getTCRaddresses').then(
		({ 0: REPToken, 1: GOVToken, 2: Registry, 3: PLCRVoting }) => {
			props.dispatch({
				type: ADD_ADDRESS,
				name: 'REPToken',
				address: REPToken
			});
			props.dispatch({
				type: ADD_ADDRESS,
				name: 'GOVToken',
				address: GOVToken
			});
			props.dispatch({
				type: ADD_ADDRESS,
				name: 'Registry',
				address: Registry
			});
			props.dispatch({
				type: ADD_ADDRESS,
				name: 'PLCRVoting',
				address: PLCRVoting
			});
		}
	);
};

const PollStatus = {
	IN_COMMIT_PERIOD: 'Commit Vote',
	IN_REVEAL_PERIOD: 'Reveal',
	PAST_REVEAL_PERIOD: '-'
};
*/
