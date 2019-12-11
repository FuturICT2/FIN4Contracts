const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const Fin4Main = artifacts.require('Fin4Main');
const Fin4TokenManagement = artifacts.require('Fin4TokenManagement');
const Fin4Claiming = artifacts.require('Fin4Claiming');
const Fin4Collections = artifacts.require('Fin4Collections');
const Fin4Messaging = artifacts.require('Fin4Messaging');
const Fin4Proving = artifacts.require('Fin4Proving');
const Fin4Groups = artifacts.require('Fin4Groups');
const Fin4SystemParameters = artifacts.require('Fin4SystemParameters');
const Fin4OracleHub = artifacts.require('Fin4OracleHub');
const proofTypeContracts = [
	artifacts.require('ApprovalByGroupMember'),
	artifacts.require('SensorOneTimeSignal'),
	artifacts.require('Idea'),
	artifacts.require('Networking'),
	artifacts.require('HappyMoment'),
	artifacts.require('SelfApprove'),
	//artifacts.require('SpecificAddress'),
	//artifacts.require('TokenCreator'),
	//artifacts.require('MinimumInterval'),
	//artifacts.require('MaximumQuantityPerInterval'),
	artifacts.require('Password'),
	//artifacts.require('Picture'),
	artifacts.require('Location'),
	//artifacts.require('SelfieTogether'),
	artifacts.require('ClaimableOnlyNTimes')
];

module.exports = async function(deployer) {
	// FIN4MAIN

	await deployer.deploy(Fin4Main);
	const Fin4MainInstance = await Fin4Main.deployed();

	// SATELLITE CONTRACTS

	await deployer.deploy(Fin4SystemParameters);
	const Fin4SystemParametersInstance = await Fin4SystemParameters.deployed();

	await deployer.deploy(Fin4Proving);
	const Fin4ProvingInstance = await Fin4Proving.deployed();
	await deployer.deploy(Fin4Claiming, Fin4SystemParametersInstance.address);
	const Fin4ClaimingInstance = await Fin4Claiming.deployed();
	await deployer.deploy(
		Fin4TokenManagement,
		Fin4ClaimingInstance.address,
		Fin4ProvingInstance.address,
		Fin4SystemParametersInstance.address
	);
	const Fin4TokenManagementInstance = await Fin4TokenManagement.deployed();
	await deployer.deploy(Fin4Collections);
	const Fin4CollectionsInstance = await Fin4Collections.deployed();
	await deployer.deploy(Fin4Messaging);
	const Fin4MessagingInstance = await Fin4Messaging.deployed();
	await deployer.deploy(Fin4Groups, Fin4MessagingInstance.address);
	const Fin4GroupsInstance = await Fin4Groups.deployed();

	await deployer.deploy(Fin4OracleHub);
	const Fin4OracleHubInstance = await Fin4OracleHub.deployed();

	await Fin4MainInstance.setSatelliteAddresses(
		Fin4TokenManagementInstance.address,
		Fin4ClaimingInstance.address,
		Fin4CollectionsInstance.address,
		Fin4MessagingInstance.address,
		Fin4ProvingInstance.address,
		Fin4GroupsInstance.address,
		Fin4SystemParametersInstance.address
	);

	// PROOF TYPES

	await Promise.all(proofTypeContracts.map(contract => deployer.deploy(contract, Fin4MessagingInstance.address)));
	const proofTypeInstances = await Promise.all(proofTypeContracts.map(contract => contract.deployed()));
	await Promise.all(proofTypeInstances.map(({ address }) => Fin4ProvingInstance.addProofType(address)));
	// ApprovalByGroupMember
	await proofTypeInstances[0].setFin4GroupsAddress(Fin4GroupsInstance.address);
	// SensorOneTimeSignal
	await proofTypeInstances[1].setFin4OracleHubAddress(Fin4OracleHubInstance.address);
	// Idea
	await proofTypeInstances[2].setFin4ProvingAddress(Fin4ProvingInstance.address);
	// Networking
	await proofTypeInstances[3].setFin4ProvingAddress(Fin4ProvingInstance.address);
	// HappyMoment
	await proofTypeInstances[4].setFin4ProvingAddress(Fin4ProvingInstance.address);

	await Fin4CollectionsInstance.setFin4GroupsAddress(Fin4GroupsInstance.address);

	// Write Fin4Main address to src/config/Fin4MainAddress.js
	let data = "const Fin4MainAddress = '" + Fin4MainInstance.address + "';\n" + 'export { Fin4MainAddress };\n';
	fs.writeFile(path.join(__dirname, config.ADDRESS_SAVING_LOCATION + '/Fin4MainAddress.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});

	// Write Fin4OracleHub address to src/config/Fin4OracleHubAddress.js
	data =
		"const Fin4OracleHubAddress = '" + Fin4OracleHubInstance.address + "';\n" + 'export { Fin4OracleHubAddress };\n';
	fs.writeFile(path.join(__dirname, config.ADDRESS_SAVING_LOCATION + '/Fin4OracleHubAddress.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});

	console.log('-----------> Address of Fin4OracleHub: ', Fin4OracleHubInstance.address);

	// await Fin4MainInstance.createNewToken('Token-Dev-1', 'TD1', [], [], []);
};
