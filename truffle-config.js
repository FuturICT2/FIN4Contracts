const path = require('path');
const HDWalletProvider = require("@truffle/hdwallet-provider");

const config = require('./config.json');

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
			gas: 7465030, // 6465030
			gasPrice: 10000000000
		},
		rinkeby_DAppNode: { // Requires VPN connection
			provider: () => new HDWalletProvider(config.MNEMONIC, 'http://my.rinkeby.dnp.dappnode.eth:8545'),
			network_id: '*',
			gas: 7465030,
			gasPrice: 10000000000,
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
	compilers: {
		solc: {
			version: "0.5.17",
		  	settings: {
				optimizer: {
					enabled: true,
					runs: 200
				},
			}
		}
	}
};
