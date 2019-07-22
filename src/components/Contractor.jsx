import Web3 from 'web3';
import Currency from './Currency';
import React from 'react';

/*
var getContractByName = function(drizzle, contractName) { // those defined in drizzle-config.js
	return getContractByAddress(drizzle, drizzle.contracts[contractName].address, contractName)
};
*/

const getContract = (drizzle, contractAddress, contractName) => {
	const contract = require('truffle-contract');
	const json = require('../build/contracts/' + contractName + '.json');
	let Contractor = contract({
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

const getAllTokenTypes = drizzle => {
	return new Promise((resolve, reject) => {
		getContractData('Fin4Main', 'Fin4Main.json', 'getChildren', [], drizzle)
			.then(tokens => {
				return tokens.map(address => {
					return getContractData(address, 'Fin4Token.json', 'getInfo', [], drizzle).then(({ 0: name, 1: symbol }) => {
						return {
							value: address,
							label: <Currency symbol={symbol} name={name} />
						};
					});
				});
			})
			.then(data => Promise.all(data))
			.then(data => {
				resolve(data);
			});
	});
};

export { getContractData, getContract, getAllTokenTypes };
