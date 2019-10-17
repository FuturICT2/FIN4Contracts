const fs = require('fs');
var path = require('path');

const Fin4Main = artifacts.require('Fin4Main');
const Fin4TokenManagement = artifacts.require('Fin4TokenManagement');
const Fin4Claiming = artifacts.require('Fin4Claiming');
const Fin4Collections = artifacts.require('Fin4Collections');
const Fin4Messages = artifacts.require('Fin4Messages');
const proofTypeContracts = [
	artifacts.require('SelfApprove'),
	artifacts.require('SpecificAddress'),
	artifacts.require('ActionTypeCreator'),
	artifacts.require('MinimumInterval'),
	artifacts.require('MaximumQuantityPerInterval'),
	artifacts.require('Password'),
	artifacts.require('Picture'),
	artifacts.require('Location'),
	artifacts.require('SelfieTogether')
];

module.exports = async function(deployer) {
	// FIN4MAIN

	await deployer.deploy(Fin4Main);
	const Fin4MainInstance = await Fin4Main.deployed();

	// SATELLITE CONTRACTS

	await deployer.deploy(Fin4Claiming);
	const Fin4ClaimingInstance = await Fin4Claiming.deployed();
	await deployer.deploy(Fin4TokenManagement, Fin4MainInstance.address, Fin4ClaimingInstance.address);
	const Fin4TokenManagementInstance = await Fin4TokenManagement.deployed();
	await deployer.deploy(Fin4Collections);
	const Fin4CollectionsInstance = await Fin4Collections.deployed();
	await deployer.deploy(Fin4Messages);
	const Fin4MessagesInstance = await Fin4Messages.deployed();

	await Fin4MainInstance.setSatelliteAddresses(
		Fin4TokenManagementInstance.address,
		Fin4ClaimingInstance.address,
		Fin4CollectionsInstance.address,
		Fin4MessagesInstance.address
	);

	// PROOF TYPES

	await Promise.all(proofTypeContracts.map(contract => deployer.deploy(contract, Fin4MessagesInstance.address)));
	const proofTypeInstances = await Promise.all(proofTypeContracts.map(contract => contract.deployed()));
	await Promise.all(proofTypeInstances.map(({ address }) => Fin4MainInstance.addProofType(address)));

	// Write Fin4Main address to src/config/DeployedAddresses.js

	let data = "const Fin4MainAddress = '" + Fin4MainInstance.address + "';\n" + 'export { Fin4MainAddress };\n';
	fs.writeFile(path.join(__dirname, '../src/config/DeployedAddresses.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});

	// await Fin4MainInstance.createNewToken('Token-Dev-1', 'TD1', [], [], []);
};
