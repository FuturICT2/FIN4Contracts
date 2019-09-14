import Fin4Main from '../build/contracts/Fin4Main.json';

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
		Fin4Main: ['Fin4TokenCreated', 'ClaimSubmitted', 'ClaimApproved']
	},
	polls: {
		accounts: 1500
	}
};

export default drizzleConfig;
