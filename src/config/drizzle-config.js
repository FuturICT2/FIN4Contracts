import Fin4Main from '../build/contracts/Fin4Main.json';
import Fin4Claim from '../build/contracts/Fin4Claim.json';
import ProofDummy from '../build/contracts/ProofDummy.json';

const drizzleConfig = {
	web3: {
		block: false,
		fallback: {
			type: 'ws',
			url: 'ws://127.0.0.1:7545'
		}
	},
	contracts: [Fin4Main, Fin4Claim, ProofDummy]
};

export default drizzleConfig;
