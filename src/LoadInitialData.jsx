import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';

class LoadInitialData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initialDataLoaded: true
		};

		// load all basic things into the store
		// TODO
		this.props.dataLoadedCallback();
		// this.setState({ initialDataLoaded: true });
	}

	render() {
		return this.state.initialDataLoaded ? null : <center>Loading initial data...</center>;
	}
}

export default drizzleConnect(LoadInitialData);
