import Fin4Main from '../build/contracts/Fin4Main.json';
import MarketOffers from '../build/contracts/MarketOffers.json';

const drizzleConfig = {
	web3: {
		block: false,
		fallback: {
			type: 'ws',
			url: 'ws://127.0.0.1:7545'
		}
	},
	contracts: [Fin4Main, MarketOffers]
};

export default drizzleConfig;
