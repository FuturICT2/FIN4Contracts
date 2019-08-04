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

const DLL = artifacts.require('tcr/PLCR/dependencies/DLL');
const AttributeStore = artifacts.require('tcr/PLCR/dependencies/AttributeStore');
const PLCRFactory = artifacts.require('tcr/PLCR/PLCRFactory');
//const Registry = artifacts.require('tcr/Registry');
//const Parametrizer = artifacts.require('tcr/Parameterizer');
const RegistryFactory = artifacts.require('tcr/RegistryFactory');
const ParameterizerFactory = artifacts.require('tcr/ParameterizerFactory');

const ERC20Plus = artifacts.require('tokens/ERC20Plus');
const Reputation = artifacts.require('tcr/Reputation');

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

	// TCR Deployment

	// Deploy Dependencies
	await deployer.deploy(DLL);
	await deployer.deploy(AttributeStore);

	// Deploy PLCRFactory
	await deployer.link(DLL, PLCRFactory);
	await deployer.link(AttributeStore, PLCRFactory);
	await deployer.deploy(PLCRFactory);

	//Deploy ParametrizerFactory
	await deployer.link(DLL, ParameterizerFactory);
	await deployer.link(AttributeStore, ParameterizerFactory);
	ParametrizerFactoryInstance = await deployer.deploy(ParameterizerFactory, PLCRFactory.address);

	//Deploy RegistryFactory
	await deployer.link(DLL, RegistryFactory);
	await deployer.link(AttributeStore, RegistryFactory);
	RegistryFactoryInstance = await deployer.deploy(RegistryFactory, ParameterizerFactory.address);

	//Deploy GOV token
	//GOVToken = await deployer.deploy(ERC20Plus, "Governance Token", "GOV", 250, address(0), true, false, true, 0);
	//await deployer.deploy(ERC20Plus)
	//await deployer.link(ERC20Plus, RegistryFactory)
	//await deployer.deploy(Reputation);
};
