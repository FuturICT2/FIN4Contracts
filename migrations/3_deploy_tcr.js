const AttributeStore = artifacts.require('tcr/AttributeStore');
const DLL = artifacts.require('tcr/PLCR/dependencies/DLL');
const PLCRFactory = artifacts.require('tcr/PLCRFactory');
const ParameterizerFactory = artifacts.require('tcr/ParameterizerFactory');
const RegistryFactory = artifacts.require('tcr/RegistryFactory');
const ERC20Plus = artifacts.require('tokens/ERC20Plus');
const Reputation = artifacts.require('tcr/Reputation');

module.exports = async function(deployer) {
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
};
