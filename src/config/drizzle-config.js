import Fin4BaseToken from '../build/contracts/Fin4BaseToken.json';
import ProofDummy from '../build/contracts/ProofDummy.json';

const drizzleConfig = {
	web3: {
		block: false,
		fallback: {
			type: 'ws',
			url: 'ws://127.0.0.1:7545'
		}
	},
	contracts: [Fin4BaseToken, ProofDummy]
};

export default drizzleConfig;
