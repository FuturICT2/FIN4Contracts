import Fin4Main from '../build/contracts/Fin4Main.json';
import { Fin4MainAddress } from './DeployedAddresses.js';

let websocketProvider = 'ws://localhost:7545';
try {
	let config = require('./deployment-config.json');
	websocketProvider = config.WEBSOCKET_PROVIDER;
} catch (err) {
	console.log('./deployment-config.json not found, using websocket provider ' + websocketProvider);
}

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider(websocketProvider));

const drizzleConfig = {
	web3: {
		block: false,
		fallback: {
			type: 'ws',
			url: 'ws://127.0.0.1:7545'
		}
	},
	contracts: [
		{
			contractName: 'Fin4Main',
			web3Contract: new web3.eth.Contract(Fin4Main.abi, Fin4MainAddress)
		}
	],
	events: {
		Fin4Main: ['Fin4TokenCreated', 'ClaimSubmitted', 'ClaimApproved']
	},
	polls: {
		accounts: 1500
	}
};

export default drizzleConfig;
