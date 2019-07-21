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

export { getContract };
