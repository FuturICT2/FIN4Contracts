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

const getContractData = (contract, contractJson, method, methodArgs = []) => {
	const currentAccount = window.web3.currentProvider.selectedAddress;

	return getContract(contract, contractJson).then(instance => {
		return instance[method].call(...methodArgs, {
			from: currentAccount
		});
	});
};

const getAllActionTypes = () => {
	return getContractData(Fin4MainAddress, 'Fin4Main', 'getChildren')
		.then(tokens => {
			return tokens.map(address => {
				return getContractData(address, 'Fin4Token', 'getInfo').then(({ 0: name, 1: symbol }) => {
					return {
						value: address,
						label: `[${symbol}] ${name}`
					};
				});
			});
		})
		.then(data => Promise.all(data));
};

export { getContractData, getContract, getAllActionTypes };
