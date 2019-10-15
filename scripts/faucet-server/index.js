const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
app.use(cors());
const title = 'FIN4Xplorer Demo Faucet Server';

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Tx = require('ethereumjs-tx'); // <-- for version 1.3.7, for version ^2.1.1 add .Transaction
const Web3 = require('web3');
const config = require('../../src/config/deployment-config.json');
const dripAmount = 0.1; // unit: ether
const networkURL = 'https://rinkeby.infura.io/v3/' + config.INFURA_API_KEY;
const provider = new HDWalletProvider(config.MNEMONIC, networkURL);
const web3 = new Web3(provider);
const address = web3.currentProvider.addresses[0];

app.listen(port, () => console.log(title + ' listening on port ' + port));

app.get('/', (req, res) => res.send(title));

app.get('/faucet', (req, res) => {
	console.log('Received funding request: ', req.query);

	checkUsersBalance(req.query.recipient, res, () => {
		// TODO also limit total/timeframed amount of requests per user? Or is total amount enough #ConceptualDecision
		sendEther(req.query.recipient, dripAmount.toString(), req.query.networkID.toString(), networkURL, res);
	});
});

let checkUsersBalance = async function(recipient, res, callback) {
	console.log('Checking ETH balance of user ' + recipient);
	web3.eth.getBalance(recipient, (err, res) => {
		if (err) {
			let report = 'Failed to check users balance, not sending Ether.';
			console.log(report);
			res.send(report);
			return;
		}
		let eth = window.web3.toDecimal(window.web3.fromWei(res, 'ether'));
		if (eth >= 1) {
			let report = 'User has more than 1 ETH (' + eth + '), not sending Ether.';
			console.log(report);
			res.send(report);
			return;
		}
		callback();
	});
};

let sendEther = async function(recipient, amount, networkID, networkURL, res) {
	console.log(
		'Attempting to send ' +
			amount +
			' ETH from ' +
			address +
			' to ' +
			recipient +
			', network: ' +
			networkID +
			' ' +
			networkURL
	);

	// TODO derive private key from mnemonic via bip39... if possible?
	let privateKey = Buffer.from(config.PRIVATE_KEY_OF_FAUCET_ACCOUNT, 'hex');

	web3.eth.getGasPrice(function(e, gasPrice) {
		console.log('Got gas price: ' + gasPrice);
		web3.eth.getTransactionCount(address).then(count => {
			console.log('Transaction count: ' + count);
			const rawTransaction = {
				from: address,
				//gasLimit: web3.utils.toHex(210000),
				gas: web3.utils.toHex(100000), // 21000,
				gasPrice: web3.utils.toHex(gasPrice * 2), // is * 2 a reasonable factor??
				to: recipient,
				value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')), //'0x0',
				chainId: web3.utils.toHex(networkID),
				//data: data,
				nonce: web3.utils.toHex(count)
			};

			var tx = new Tx(rawTransaction);
			tx.sign(privateKey);
			console.log('Transaction is signed');

			web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex')).on('receipt', receipt => {
				let report = 'Sent ' + amount + ' ETH to ' + recipient; // + ' from ' + address;
				console.log(report);
				res.send(report);
				//process.exit(0);
			});
		});
	});
};

/*
const getNetworkURL = networkID => {
	switch (networkID) {
		case '3':
			return 'https://ropsten.infura.io/v3/' + config.INFURA_API_KEY;
		case '4':
			return 'https://rinkeby.infura.io/v3/' + config.INFURA_API_KEY;
		case '5':
			return 'https://goerli.infura.io/v3/' + config.INFURA_API_KEY;
		case '5777':
			return 'http://127.0.0.1:7545';
	}
};
*/
