// originally from www.trufflesuite.com/tutorials/drizzle-and-contract-events

import { generateStore, EventActions } from 'drizzle';
import drizzleOptions from '../config/drizzle-config';
import { toast } from 'react-toastify';
import { ADD_FIN4_TOKEN, ADD_MULTIPLE_FIN4_TOKENS } from './actionTypes';

const contractEventNotifier = store => next => action => {
	if (action.type !== EventActions.EVENT_FIRED) {
		return next(action);
	}

	const contract = action.name;
	const contractEvent = action.event.event;
	let display = `${contract}: ${contractEvent}`;

	if (contractEvent === 'Fin4TokenCreated') {
		let address = action.event.returnValues.addr;
		let name = action.event.returnValues.name;
		let symbol = action.event.returnValues.symbol;
		display = 'New Fin4 token created: ' + name + ' [' + symbol + ']';

		store.dispatch({
			type: ADD_FIN4_TOKEN,
			token: {
				name: name,
				symbol: symbol,
				address: address
			}
		});
	}

	toast.success(display, { position: toast.POSITION.TOP_RIGHT });
	return next(action);
};

const appMiddlewares = [contractEventNotifier];

const initialState = {
	fin4Tokens: []
};

function fin4StoreReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_FIN4_TOKEN:
			return Object.assign({}, state, {
				fin4Tokens: [...state.fin4Tokens, action.token]
			});
		case ADD_MULTIPLE_FIN4_TOKENS:
			return Object.assign({}, state, {
				fin4Tokens: [...state.fin4Tokens, ...action.tokenArr]
			});
		default:
			return state;
	}
}

const appReducers = { fin4Store: fin4StoreReducer };

export default generateStore({
	drizzleOptions,
	appReducers,
	appMiddlewares,
	disableReduxDevTools: false // enable ReduxDevTools!
});
