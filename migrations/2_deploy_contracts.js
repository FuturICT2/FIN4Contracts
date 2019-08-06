const Fin4Main = artifacts.require('Fin4Main');
const Fin4Messages = artifacts.require('Fin4Messages');
const contracts = [
	artifacts.require('ImmediateAuto'),
	artifacts.require('SpecificAddress'),
	artifacts.require('ActionTypeCreator'),
	artifacts.require('MinimumInterval'),
	artifacts.require('MaximumQuantityPerInterval'),
	artifacts.require('Password'),
	artifacts.require('Picture'),
	artifacts.require('Location')
];

var path = require('path');

module.exports = async function(deployer) {
	// via https://ethereum.stackexchange.com/a/30579
	// TODO make a nice loop here through all ProofTypes in /contracts/proof without having to list them specifically?

	await deployer.deploy(Fin4Main);
	await deployer.deploy(Fin4Messages);

	const Fin4MainInstance = await Fin4Main.deployed();

	// write Fin4Main address to src/config/Fin4MainAddress.js
	let data = "const Fin4MainAddress = '" + Fin4MainInstance.address + "';\n" + 'export { Fin4MainAddress };\n';
	const fs = require('fs');
	fs.writeFile(path.join(__dirname, '../src/config/DeployedAddresses.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});

	const Fin4MessagesInstance = await Fin4Messages.deployed();
	await Fin4MainInstance.setFin4MessagesAddress(Fin4MessagesInstance.address);

	await Promise.all(contracts.map(contract => deployer.deploy(contract, Fin4MainInstance.address)));

	const proofTypeInstances = await Promise.all(contracts.map(contract => contract.deployed()));

	await Promise.all(proofTypeInstances.map(({ address }) => Fin4MainInstance.addProofType(address)));

	// temp: tokens to work on TCR dev
	await Fin4MainInstance.createNewToken('Token-TCR-Dev-1', 'TD1', [], [], []);
	await Fin4MainInstance.createNewToken('Token-TCR-Dev-2', 'TD2', [], [], []);
	await Fin4MainInstance.createNewToken('Token-TCR-Dev-3', 'TD3', [], [], []);
};
