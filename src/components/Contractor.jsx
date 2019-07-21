import Web3 from 'web3';

/*
var getContractByName = function(drizzle, contractName) { // those defined in drizzle-config.js
	return getContractByAddress(drizzle, drizzle.contracts[contractName].address, contractName)
};
*/

var getContract = function(drizzle, contractAddress, contractName) {
	var contract = require('truffle-contract');
	const json = require('../build/contracts/' + contractName + '.json');
	var Contractor = contract({
		abi: json.abi
	});
	Contractor.setProvider(drizzle.web3.givenProvider);
	return Contractor.at(contractAddress);
};

const getContractData = (contract, contractJson, method, methodArgs, drizzle) => {
	// add contract if not yet added
	if (!Object.keys(drizzle.contracts).includes(contract)) {
		console.log(`adding contract ${contract}`);
		const tokenJson = require('../build/contracts/' + contractJson);
		const web3 = new Web3(window.web3.currentProvider);
		drizzle.addContract({
			contractName: contract,
			web3Contract: new web3.eth.Contract(tokenJson.abi, contract)
		});
	}
	return new Promise((resolve, reject) => {
		// addContract() needs time and has no callback -> try every 1ms until successful
		var tryAgain = setInterval(() => {
			if (Object.keys(drizzle.contracts).includes(contract)) {
				console.log(`found contract ${contract}`);
				clearInterval(tryAgain);
				// apply method
				resolve(drizzle.contracts[contract].methods[method](...methodArgs).call());
			} else {
				console.log(`trying to find contract ${contract}`);
			}
		}, 1);
	});
};

export { getContractData, getContract };
