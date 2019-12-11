const path = require('path');
const HDWalletProvider = require("@truffle/hdwallet-provider");

var config;
try {
	config = require('./config.json');
} catch (err) {
	console.log('./config.json not found');
}

module.exports = {
	contracts_build_directory: path.join(__dirname, config.CONTRACTS_BUILD_DIRECTORY),
	networks: {
		development: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*'
		},
		ropsten: {
			provider: function() {
				return new HDWalletProvider(config.MNEMONIC, 'https://ropsten.infura.io/v3/' + config.INFURA_API_KEY);
			},
			network_id: 3,
			gas: 4465030,
			gasPrice: 10000000000
		},
		rinkeby: {
			provider: function() {
				return new HDWalletProvider(config.MNEMONIC, 'https://rinkeby.infura.io/v3/' + config.INFURA_API_KEY);
			},
			network_id: 4,
			gas: 6465030,
			gasPrice: 10000000000
		},
		goerli: {
			provider: function() {
				return new HDWalletProvider(config.MNEMONIC, 'https://goerli.infura.io/v3/' + config.INFURA_API_KEY);
			},
			network_id: 5,
			gas: 7465030,
			gasPrice: 10000000000
		}
	},
	solc: {
		optimizer: {
			enabled: true,
			runs: 200
		}
	}
};
