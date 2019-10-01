// originally from www.trufflesuite.com/tutorials/drizzle-and-contract-events
import { generateStore, EventActions } from 'drizzle';
import drizzleOptions from '../config/drizzle-config';
import { toast } from 'react-toastify';
import {
	ADD_FIN4_TOKEN,
	ADD_MULTIPLE_FIN4_TOKENS,
	ADD_CLAIM,
	ADD_MULTIPLE_CLAIMS,
	APPROVE_CLAIM,
	ADD_ADDRESS,
	UPDATE_BALANCE,
	UPDATE_MULTIPLE_BALANCES,
	ADD_MULTIPLE_PROOF_TYPES,
	SET_DEFAULT_ACCOUNT,
	ONE_PROOF_ON_CLAIM_APPROVAL
} from './actionTypes';
const BN = require('bignumber.js');

const contractEventNotifier = store => next => action => {
	if (action.type !== EventActions.EVENT_FIRED) {
		return next(action);
	}

	const contract = action.name;
	const contractEvent = action.event.event;
	let display = `${contract}: ${contractEvent}`;

	if (contractEvent === 'Fin4TokenCreated') {
		let token = action.event.returnValues;
		let address = token.addr;

		// block duplicate events, seems easier this "definite" way then latest block?
		if (store.getState().fin4Store.fin4Tokens[address]) {
			return next(action);
		}

		let name = token.name;
		let symbol = token.symbol;
		display = 'New Fin4 token created: ' + name + ' [' + symbol + ']';

		store.dispatch({
			type: ADD_FIN4_TOKEN,
			token: {
				address: address,
				name: name,
				symbol: symbol,
				description: token.description,
				unit: token.unit
			}
		});
	}

	let currentAccount = store.getState().fin4Store.defaultAccount;

	if (contractEvent === 'ClaimSubmitted') {
		let claim = action.event.returnValues;
		let id = claim.tokenAddr + '_' + claim.claimId; // pseudoId, just for frontend
		let isCurrentUsersClaim = claim.claimer.toLowerCase() === currentAccount;

		// block: claim-event not caused by current user / duplicate events
		if (!isCurrentUsersClaim || store.getState().fin4Store.usersClaims[id]) {
			return next(action);
		}

		let quantity = new BN(claim.quantity).toNumber();
		let token = store.getState().fin4Store.fin4Tokens[claim.tokenAddr];
		display = 'You are claiming ' + quantity + ' ' + token.name + ' [' + token.symbol + '] tokens';

		let proofStatusesObj = {};
		for (let i = 0; i < claim.requiredProofTypes.length; i++) {
			proofStatusesObj[claim.requiredProofTypes[i]] = false;
		}

		store.dispatch({
			type: ADD_CLAIM,
			claim: {
				id: id,
				token: claim.tokenAddr,
				claimId: claim.claimId,
				claimer: claim.claimer,
				isApproved: false,
				quantity: quantity,
				date: new BN(claim.date).toNumber(),
				comment: claim.comment,
				proofStatuses: proofStatusesObj
			}
		});
	}

	if (contractEvent === 'ClaimApproved') {
		let claim = action.event.returnValues;
		let id = claim.tokenAddr + '_' + claim.claimId; // pseudoId
		let isCurrentUsersClaim = claim.claimer.toLowerCase() === currentAccount;

		// block: current user is not claimer / duplicate events / claim is already approved
		let usersClaims = store.getState().fin4Store.usersClaims;
		if (!isCurrentUsersClaim || (usersClaims[id] && usersClaims[id].isApproved)) {
			return next(action);
		}

		let token = store.getState().fin4Store.fin4Tokens[claim.tokenAddr];
		display =
			'Claim approved: you got ' + usersClaims[id].quantity + ' ' + token.name + ' [' + token.symbol + '] tokens';

		store.dispatch({
			type: APPROVE_CLAIM,
			id: id
		});

		store.dispatch({
			type: UPDATE_BALANCE,
			tokenAddress: claim.tokenAddr,
			balance: Number(claim.newBalance)
		});
	}

	if (contractEvent === 'OneProofOnClaimApproval') {
		let approvedProof = action.event.returnValues;
		let belongsToCurrentUsersClaim = approvedProof.claimer.toLowerCase() === currentAccount;
		let pseudoClaimId = approvedProof.tokenAdrToReceiveProof + '_' + approvedProof.claimId;

		let usersClaims = store.getState().fin4Store.usersClaims;
		if (!usersClaims[pseudoClaimId]) {
			console.log('Dev: this should not happen! Investigate why');
			return next(action);
		}

		let claim = usersClaims[pseudoClaimId];
		// block: proof-approval belongs to claim not of current user / duplicate events / proof on claim is already approved
		if (!belongsToCurrentUsersClaim || claim.proofStatuses[approvedProof.proofTypeAddress] === true) {
			return next(action);
		}

		display = 'One proof of your claim got approved'; // TODO show more info

		store.dispatch({
			type: ONE_PROOF_ON_CLAIM_APPROVAL,
			pseudoClaimId: pseudoClaimId,
			proofType: approvedProof.proofTypeAddress
		});
	}

	toast.success(display, { position: toast.POSITION.TOP_RIGHT });
	return next(action);
};

const appMiddlewares = [contractEventNotifier];

const initialState = {
	fin4Tokens: {},
	usersClaims: {},
	usersBalances: {},
	proofTypes: {},
	addresses: {},
	defaultAccount: null
};

function fin4StoreReducer(state = initialState, action) {
	let i = 0;
	switch (action.type) {
		case ADD_FIN4_TOKEN:
			return {
				...state,
				fin4Tokens: {
					...state.fin4Tokens,
					[action.token.address]: action.token
				}
			};
		case ADD_MULTIPLE_FIN4_TOKENS:
			for (i = 0; i < action.tokenArr.length; i++) {
				let token = action.tokenArr[i];
				state = {
					...state,
					fin4Tokens: {
						...state.fin4Tokens,
						[token.address]: token
					}
				};
			}
			return state;
		case ADD_CLAIM:
			return {
				...state,
				usersClaims: {
					...state.usersClaims,
					[action.claim.id]: action.claim
				}
			};
		case ADD_MULTIPLE_CLAIMS:
			for (i = 0; i < action.claimArr.length; i++) {
				let claim = action.claimArr[i];
				state = {
					...state,
					usersClaims: {
						...state.usersClaims,
						[claim.id]: claim
					}
				};
			}
			return state;
		case APPROVE_CLAIM:
			return {
				...state,
				usersClaims: {
					...state.usersClaims,
					[action.id]: {
						...state.usersClaims[action.id],
						isApproved: true
					}
				}
			};
		case ADD_ADDRESS:
			return {
				...state,
				addresses: {
					...state.addresses,
					[action.name]: action.address
				}
			};
		case UPDATE_BALANCE:
			return {
				...state,
				usersBalances: {
					...state.usersBalances,
					[action.tokenAddress]: action.balance
				}
			};
		case UPDATE_MULTIPLE_BALANCES:
			for (i = 0; i < action.tokenAddresses.length; i++) {
				state = {
					...state,
					usersBalances: {
						...state.usersBalances,
						[action.tokenAddresses[i]]: action.balances[i]
					}
				};
			}
			return state;
		case ADD_MULTIPLE_PROOF_TYPES:
			for (i = 0; i < action.proofTypesArr.length; i++) {
				let proofType = action.proofTypesArr[i];
				state = {
					...state,
					proofTypes: {
						...state.proofTypes,
						[proofType.value]: proofType // TODO change value to address and label to name
					}
				};
			}
			return state;
		case SET_DEFAULT_ACCOUNT:
			return {
				...state,
				defaultAccount: action.account
			};
		case ONE_PROOF_ON_CLAIM_APPROVAL:
			return {
				...state,
				usersClaims: {
					...state.usersClaims,
					[action.pseudoClaimId]: {
						...state.usersClaims[action.pseudoClaimId],
						proofStatuses: {
							...state.usersClaims[action.pseudoClaimId].proofStatuses,
							[action.proofType]: true
						}
					}
				}
			};
		default:
			return state;
	}
	//return Object.assign({}, state, {
	//	usersClaims: [...state.usersClaims, ...action.claimArr]
	//});
}

const appReducers = { fin4Store: fin4StoreReducer };

export default generateStore({
	drizzleOptions,
	appReducers,
	appMiddlewares,
	disableReduxDevTools: false // enable ReduxDevTools!
});
