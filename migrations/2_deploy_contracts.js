const Fin4Main = artifacts.require('Fin4Main');
const ImmediateAuto = artifacts.require('ImmediateAuto');
const SpecificAddress = artifacts.require('SpecificAddress');
const TokenCreator = artifacts.require('TokenCreator');
const MinimumInterval = artifacts.require('MinimumInterval');
const Password = artifacts.require('Password');
const MaximumQuantityPerInterval = artifacts.require('MaximumQuantityPerInterval');

module.exports = async function(deployer) {
	// via https://ethereum.stackexchange.com/a/30579
	// TODO make a nice loop here through all ProofTypes in /contracts/proof without having to list them specifically?

	await deployer.deploy(Fin4Main);

	const Fin4MainInstance = await Fin4Main.deployed();

	const contracts = [
		ImmediateAuto,
		SpecificAddress,
		TokenCreator,
		MinimumInterval,
		Password,
		MaximumQuantityPerInterval
	];

	await Promise.all(contracts.map(contract => deployer.deploy(contract, Fin4MainInstance.address)));

	const proofTypeInstances = await Promise.all(contracts.map(contract => contract.deployed()));

	await Promise.all(
		proofTypeInstances.map(proofTypeInstance => Fin4MainInstance.addProofType(proofTypeInstance.address))
	);
};
