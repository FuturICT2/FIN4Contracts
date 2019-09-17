import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { loadInitialDataIntoStore } from './components/Contractor';

class LoadInitialData extends Component {
	constructor(props) {
		super(props);
		// load initial data into the store
		loadInitialDataIntoStore(props);
	}

	render() {
		return null;
	}
}

export default drizzleConnect(LoadInitialData);
