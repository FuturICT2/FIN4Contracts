const fs = require('fs');
var path = require('path');

const Fin4Main = artifacts.require('Fin4Main');
const Fin4TokenManagement = artifacts.require('Fin4TokenManagement');
const Fin4Claiming = artifacts.require('Fin4Claiming');
const Fin4Collections = artifacts.require('Fin4Collections');
const Fin4Messaging = artifacts.require('Fin4Messaging');
const Fin4Proofing = artifacts.require('Fin4Proofing');
const Fin4Groups = artifacts.require('Fin4Groups');
const proofTypeContracts = [
	artifacts.require('SelfApprove'),
	artifacts.require('SpecificAddress'),
	artifacts.require('ActionTypeCreator'),
	artifacts.require('MinimumInterval'),
	artifacts.require('MaximumQuantityPerInterval'),
	artifacts.require('Password'),
	artifacts.require('Picture'),
	artifacts.require('Location'),
	artifacts.require('SelfieTogether'),
	artifacts.require('ApprovalByGroupMember')
];

module.exports = async function(deployer) {
	// FIN4MAIN

	await deployer.deploy(Fin4Main);
	const Fin4MainInstance = await Fin4Main.deployed();

	// SATELLITE CONTRACTS

	await deployer.deploy(Fin4Proofing);
	const Fin4ProofingInstance = await Fin4Proofing.deployed();
	await deployer.deploy(Fin4Claiming);
	const Fin4ClaimingInstance = await Fin4Claiming.deployed();
	await deployer.deploy(Fin4TokenManagement, Fin4ClaimingInstance.address, Fin4ProofingInstance.address);
	const Fin4TokenManagementInstance = await Fin4TokenManagement.deployed();
	await deployer.deploy(Fin4Collections);
	const Fin4CollectionsInstance = await Fin4Collections.deployed();
	await deployer.deploy(Fin4Messaging);
	const Fin4MessagingInstance = await Fin4Messaging.deployed();
	await deployer.deploy(Fin4Groups);
	const Fin4GroupsInstance = await Fin4Groups.deployed();

	await Fin4MainInstance.setSatelliteAddresses(
		Fin4TokenManagementInstance.address,
		Fin4ClaimingInstance.address,
		Fin4CollectionsInstance.address,
		Fin4MessagingInstance.address,
		Fin4ProofingInstance.address,
		Fin4GroupsInstance.address
	);

	// PROOF TYPES

	await Promise.all(proofTypeContracts.map(contract => deployer.deploy(contract, Fin4MessagingInstance.address)));
	const proofTypeInstances = await Promise.all(proofTypeContracts.map(contract => contract.deployed()));
	await Promise.all(proofTypeInstances.map(({ address }) => Fin4ProofingInstance.addProofType(address)));

	// ApprovalByGroupMember
	await proofTypeInstances[9].setFin4GroupsAddress(Fin4GroupsInstance.address);

	// Write Fin4Main address to src/config/DeployedAddresses.js

	let data = "const Fin4MainAddress = '" + Fin4MainInstance.address + "';\n" + 'export { Fin4MainAddress };\n';
	fs.writeFile(path.join(__dirname, '../src/config/DeployedAddresses.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});

	// await Fin4MainInstance.createNewToken('Token-Dev-1', 'TD1', [], [], []);
};
