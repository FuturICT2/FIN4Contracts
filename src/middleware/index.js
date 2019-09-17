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
	UPDATE_MULTIPLE_BALANCES
} from './actionTypes';

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
				description: token.description
			}
		});
	}

	if (contractEvent === 'ClaimSubmitted') {
		let claim = action.event.returnValues;
		let id = claim.tokenAddr + '_' + claim.claimId; // pseudoId, just for frontend

		// block duplicate events
		if (store.getState().fin4Store.usersClaims[id]) {
			return next(action);
		}

		display = 'New claim submitted';

		store.dispatch({
			type: ADD_CLAIM,
			claim: {
				id: id,
				token: claim.tokenAddr,
				claimId: claim.claimId,
				claimer: claim.claimer,
				quantity: claim.quantity,
				date: claim.date,
				comment: claim.comment,
				isApproved: false
			}
		});
	}

	if (contractEvent === 'ClaimApproved') {
		let claim = action.event.returnValues;
		let id = claim.tokenAddr + '_' + claim.claimId; // pseudoId

		// block duplicate events, claim is already approved
		if (store.getState().fin4Store.usersClaims[id] && store.getState().fin4Store.usersClaims[id].isApproved) {
			return next(action);
		}

		display = 'Claim got approved';

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

	toast.success(display, { position: toast.POSITION.TOP_RIGHT });
	return next(action);
};

const appMiddlewares = [contractEventNotifier];

const initialState = {
	fin4Tokens: {},
	usersClaims: {},
	usersBalances: {},
	addresses: {}
};

function fin4StoreReducer(state = initialState, action) {
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
			for (var i = 0; i < action.tokenArr.length; i++) {
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
			for (var i = 0; i < action.claimArr.length; i++) {
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
			for (var i = 0; i < action.tokenAddresses.length; i++) {
				state = {
					...state,
					usersBalances: {
						...state.usersBalances,
						[action.tokenAddresses[i]]: action.balances[i]
					}
				};
			}
			return state;
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
