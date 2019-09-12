import Fin4Main from '../build/contracts/Fin4Main.json';
//import { Fin4MainAddress } from './DeployedAddresses.js';

//var Web3 = require('web3');
//var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));

const drizzleConfig = {
	web3: {
		block: false,
		fallback: {
			type: 'ws',
			url: 'ws://127.0.0.1:7545'
		}
	},
	contracts: [Fin4Main],
	events: {
		Fin4Main: ['Fin4TokenCreated']
	},
	polls: {
		accounts: 1500
	}
};

export default drizzleConfig;
