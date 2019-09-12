// originally from www.trufflesuite.com/tutorials/drizzle-and-contract-events

import { generateStore, EventActions } from 'drizzle';
import drizzleOptions from '../config/drizzle-config';
import { toast } from 'react-toastify';

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
			name: name,
			symbol: symbol,
			address: address
		});
	}

	toast.success(display, { position: toast.POSITION.TOP_RIGHT });
	return next(action);
};

const appMiddlewares = [contractEventNotifier];

// action types
const ADD_FIN4_TOKEN = 'ADD_FIN4_TOKEN';

const initialState = {
	fin4Tokens: []
};

function fin4tokensReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_FIN4_TOKEN:
			return Object.assign({}, state, {
				fin4Tokens: [...state.fin4Tokens, action]
			});
		default:
			return state;
	}
}

const appReducers = { fin4Tokens: fin4tokensReducer };

export default generateStore({
	drizzleOptions,
	appReducers,
	appMiddlewares,
	disableReduxDevTools: false // enable ReduxDevTools!
});
