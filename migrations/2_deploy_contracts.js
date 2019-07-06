const Fin4Main = artifacts.require('Fin4Main');
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

module.exports = async function(deployer) {
	// via https://ethereum.stackexchange.com/a/30579
	// TODO make a nice loop here through all ProofTypes in /contracts/proof without having to list them specifically?

	await deployer.deploy(Fin4Main);

	const Fin4MainInstance = await Fin4Main.deployed();

	await Promise.all(contracts.map(contract => deployer.deploy(contract, Fin4MainInstance.address)));

	const proofTypeInstances = await Promise.all(contracts.map(contract => contract.deployed()));

	await Promise.all(proofTypeInstances.map(({ address }) => Fin4MainInstance.addProofType(address)));
};
