const Web3 = require('web3');
const bip39 = require('bip39');
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const path = require('path');

let n = 5;
let csv = [];

for (let i = 0; i < n; i++) {
	let mnemonic = bip39.generateMnemonic();
	let provider = new HDWalletProvider(mnemonic, '');
	let web3 = new Web3(provider);
	let address = web3.currentProvider.addresses[0];
	csv.push(address + ',' + mnemonic);
}

fs.writeFile(path.join(__dirname, 'generated-accounts.csv'), csv.join('\n'), () => {});
