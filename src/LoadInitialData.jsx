import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { loadInitialDataIntoStore } from './components/Contractor';

class LoadInitialData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initialDataLoaded: true
		};

		// load initial data into the store
		loadInitialDataIntoStore(props, () => {
			this.props.dataLoadedCallback();
			this.setState({ initialDataLoaded: true });
		});
	}

	render() {
		return this.state.initialDataLoaded ? null : <center>Loading initial data...</center>;
	}
}

export default drizzleConnect(LoadInitialData);
