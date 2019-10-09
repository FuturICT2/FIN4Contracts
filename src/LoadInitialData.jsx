import { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { loadInitialDataIntoStore } from './components/Contractor';

class LoadInitialData extends Component {
	constructor(props) {
		super(props);

		this.unlockAccount(props);
	}

	async unlockAccount(props) {
		try {
			let accounts = await window.ethereum.enable();

			// load initial data into the store
			loadInitialDataIntoStore(props);
		} catch (error) {
			//alert('Could not enable DApp');
			console.log('error', error);
		}
	}

	render() {
		return null;
	}
}

export default drizzleConnect(LoadInitialData);
