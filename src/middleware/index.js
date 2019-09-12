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
		let name = action.event.returnValues.name;
		let symbol = action.event.returnValues.symbol;
		display = 'New Fin4 token created: ' + name + ' [' + symbol + ']';
	}

	toast.success(display, { position: toast.POSITION.TOP_RIGHT });

	return next(action);
};

const appMiddlewares = [contractEventNotifier];

export default generateStore({
	drizzleOptions,
	appMiddlewares,
	disableReduxDevTools: false // enable ReduxDevTools!
});
