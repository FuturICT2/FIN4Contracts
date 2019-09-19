import Fin4Main from '../build/contracts/Fin4Main.json';
import { Fin4MainAddress } from './DeployedAddresses.js';

var Web3 = require('web3');
var web3 = new Web3(window.web3.currentProvider);

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
