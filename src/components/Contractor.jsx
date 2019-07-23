import Currency from './Currency';
import React from 'react';
import { Fin4MainAddress } from '../config/DeployedAddresses.js';

/*
var getContractByName = function(drizzle, contractName) { // those defined in drizzle-config.js
	return getContractByAddress(drizzle, drizzle.contracts[contractName].address, contractName)
};
*/

const getContract = (contractAddress, contractName) => {
	const contract = require('truffle-contract');
	const json = require('../build/contracts/' + contractName + '.json');
	let Contractor = contract({
		abi: json.abi
	});
	Contractor.setProvider(window.web3.currentProvider);
	return Contractor.at(contractAddress);
};

const getContractData = (contract, contractJson, method, methodArgs) => {
	var currentAccount = window.web3.currentProvider.selectedAddress;

	return new Promise((resolve, reject) => {
		getContract(contract, contractJson)
			.then(function(instance) {
				return instance[method].call(...methodArgs, {
					from: currentAccount
				});
			})
			.then(function(result) {
				resolve(result);
			});
	});
};

/*
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
*/

const getAllTokenTypes = () => {
	return new Promise((resolve, reject) => {
		getContractData(Fin4MainAddress, 'Fin4Main', 'getChildren', [])
			.then(tokens => {
				return tokens.map(address => {
					return getContractData(address, 'Fin4Token', 'getInfo', []).then(({ 0: name, 1: symbol }) => {
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

const getNetworkName = () => {
	return new Promise((resolve, reject) => {
		window.web3.version.getNetwork((err, netId) => {
			switch (netId) {
				case '1':
					resolve('MainNet');
					break;
				case '3':
					resolve('Ropsten');
					break;
				case '4':
					resolve('Rinkeby');
					break;
				case '5':
					resolve('Goerli');
					break;
				case '42':
					resolve('Kovan');
					break;
				default:
					resolve('Unknown');
			}
		});
	});
};

const getNetworkBalance = () => {
	return new Promise((resolve, reject) => {
		let currentAccount = window.web3.currentProvider.selectedAddress;
		window.web3.eth.getBalance(currentAccount, function(error, result) {
			resolve(result);
		});
	});
};

export { getContractData, getContract, getAllTokenTypes, getNetworkName, getNetworkBalance };
