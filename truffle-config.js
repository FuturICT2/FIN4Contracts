const path = require('path');
var HDWalletProvider = require('truffle-hdwallet-provider');

//Get the keys, to not use mnemonic
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./migrations/config.json'));
const tokenHolders = config.token.tokenHolders;
MNEMONIC = 'camera exclude mail month insect grab eye bubble involve burger soldier ghost';

var keys;
try {
	keys = require('./src/config/ethereum-keys.json');
} catch (err) {
	console.log('./src/config/ethereum-keys.json not found');
}

module.exports = {
	contracts_build_directory: path.join(__dirname, 'src/build/contracts'),
	networks: {
		account1: {
			provider: function() {
				return new HDWalletProvider(MNEMONIC, 'http://127.0.0.1:7545');
			},
			host: '127.0.0.1',
			port: 7545,
			network_id: '5777'
		},
		account2: {
			provider: function() {
				return new HDWalletProvider(MNEMONIC, 'http://127.0.0.1:7545', 1);
			},
			host: '127.0.0.1',
			port: 7545,
			network_id: '5777',
			from: '0x89D566c1dBCc16E72bcF99FaA2A3E8bd0B00C61c'
		},
		account3: {
			provider: function() {
				return new HDWalletProvider(MNEMONIC, 'http://127.0.0.1:7545', 2);
			},
			host: '127.0.0.1',
			port: 7545,
			network_id: '5777',
			from: '0x89D566c1dBCc16E72bcF99FaA2A3E8bd0B00C61c'
		},
		ropsten: {
			provider: function() {
				return new HDWalletProvider(keys.MNEMONIC, 'https://ropsten.infura.io/v3/' + keys.INFURA_API_KEY);
			},
			network_id: 3,
			gas: 4465030,
			gasPrice: 10000000000
		},
		rinkeby: {
			provider: function() {
				return new HDWalletProvider(keys.MNEMONIC, 'https://rinkeby.infura.io/v3/' + keys.INFURA_API_KEY);
			},
			network_id: 4,
			gas: 6465030,
			gasPrice: 10000000000
		},
		goerli: {
			provider: function() {
				return new HDWalletProvider(keys.MNEMONIC, 'https://goerli.infura.io/v3/' + keys.INFURA_API_KEY);
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
