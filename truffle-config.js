const path = require('path');
var HDWalletProvider = require("truffle-hdwallet-provider");

var keys;
try {
	keys = require('./src/config/keys.json');
} catch(err) {
	console.log("./src/config/keys.json not found");
}

module.exports = {
	contracts_build_directory: path.join(__dirname, 'src/build/contracts'),
	networks: {
		development: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*'
		},
		ropsten: {
			provider: function() {
			  return new HDWalletProvider(keys.MNEMONIC, 'https://ropsten.infura.io/v3/' + keys.INFURA_API_KEY)
			},
			network_id: 3,
			gas: 4465030,
			gasPrice: 10000000000
		},
		goerli_infura: {
			provider: function() {
				return new HDWalletProvider(keys.MNEMONIC, 'https://goerli.infura.io/v3/' + keys.INFURA_API_KEY)
			  },
			  network_id: 7,
			  gas: 4465030,
			  gasPrice: 10000000000
		},
		goerli_avado: {
			provider: function() {
				return new HDWalletProvider(keys.MNEMONIC, 'http://172.20.0.103:8545/')
			  },
			  network_id: 5,
			  gas: 4465030,
			  gasPrice: 10000000000
		}
	}
};
