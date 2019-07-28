import { Fin4MainAddress } from '../config/DeployedAddresses.js';

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
	const currentAccount = window.web3.currentProvider.selectedAddress;

	return getContract(contract, contractJson).then(instance => {
		return instance[method].call(...methodArgs, {
			from: currentAccount
		});
	});
};

const getAllActionTypes = () => {
	return getContractData(Fin4MainAddress, 'Fin4Main', 'getChildren', [])
		.then(tokens => {
			return tokens.map(address => {
				return getContractData(address, 'Fin4Token', 'getInfo', []).then(({ 0: name, 1: symbol }) => {
					return {
						value: address,
						label: `[${symbol}] ${name}`
					};
				});
			});
		})
		.then(data => Promise.all(data));
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
		window.web3.eth.getBalance(currentAccount, (error, result) => {
			resolve(result);
		});
	});
};

export { getContractData, getContract, getAllActionTypes, getNetworkName, getNetworkBalance };
