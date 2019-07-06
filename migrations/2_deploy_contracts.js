const Fin4Main = artifacts.require('Fin4Main');
const ImmediateAutoApproval = artifacts.require('ImmediateAutoApproval');
const ApprovalBySpecificAddress = artifacts.require('ApprovalBySpecificAddress');
const ApprovalByTokenCreator = artifacts.require('ApprovalByTokenCreator');
const MinimumClaimingInterval = artifacts.require('MinimumClaimingInterval');
const Password = artifacts.require('Password');
const MaximumQuantityPerInterval = artifacts.require('MaximumQuantityPerInterval');
const PictureApprovalBySpecificAddress = artifacts.require('PictureApprovalBySpecificAddress');

module.exports = async function(deployer) {
	// via https://ethereum.stackexchange.com/a/30579
	// TODO make a nice loop here through all ProofTypes in /contracts/proof without having to list them specifically?

	await deployer.deploy(Fin4Main);

	const Fin4MainInstance = await Fin4Main.deployed();

	const contracts = [
		ImmediateAutoApproval,
		ApprovalBySpecificAddress,
		ApprovalByTokenCreator,
		MinimumClaimingInterval,
		Password,
		MaximumQuantityPerInterval,
		PictureApprovalBySpecificAddress
	];

	await Promise.all(contracts.map(contract => deployer.deploy(contract, Fin4MainInstance.address)));

	const proofTypeInstances = await Promise.all(contracts.map(contract => contract.deployed()));

	await Promise.all(
		proofTypeInstances.map(proofTypeInstance => Fin4MainInstance.addProofType(proofTypeInstance.address))
	);
};
