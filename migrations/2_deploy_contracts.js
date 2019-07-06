const Fin4Main = artifacts.require('Fin4Main');
const ImmediateAutoApproval = artifacts.require('ImmediateAutoApproval');
const ApprovalBySpecificAddress = artifacts.require('ApprovalBySpecificAddress');
const ApprovalByTokenCreator = artifacts.require('ApprovalByTokenCreator');
const MinimumClaimingInterval = artifacts.require('MinimumClaimingInterval');
const KnowPassword = artifacts.require('KnowPassword');
const MaximumQuantityPerInterval = artifacts.require('MaximumQuantityPerInterval');

module.exports = async function (deployer) {

	// via https://ethereum.stackexchange.com/a/30579
	// TODO make a nice loop here through all ProofTypes in /contracts/proof without having to list them specifically?

	await deployer.deploy(Fin4Main);
	var Fin4MainInstance = await Fin4Main.deployed();

	await Promise.all([
		deployer.deploy(ImmediateAutoApproval, Fin4MainInstance.address),
		deployer.deploy(ApprovalBySpecificAddress, Fin4MainInstance.address),
		deployer.deploy(ApprovalByTokenCreator, Fin4MainInstance.address),
		deployer.deploy(MinimumClaimingInterval, Fin4MainInstance.address),
		deployer.deploy(KnowPassword, Fin4MainInstance.address),
		deployer.deploy(MaximumQuantityPerInterval, Fin4MainInstance.address)
	]);

	var proofTypeInstances = await Promise.all([
		ImmediateAutoApproval.deployed(),
		ApprovalBySpecificAddress.deployed(),
		ApprovalByTokenCreator.deployed(),
		MinimumClaimingInterval.deployed(),
		KnowPassword.deployed(),
		MaximumQuantityPerInterval.deployed()
	]);

	await Promise.all([
		Fin4MainInstance.addProofType(proofTypeInstances[0].address),
		Fin4MainInstance.addProofType(proofTypeInstances[1].address),
		Fin4MainInstance.addProofType(proofTypeInstances[2].address),
		Fin4MainInstance.addProofType(proofTypeInstances[3].address),
		Fin4MainInstance.addProofType(proofTypeInstances[4].address),
		Fin4MainInstance.addProofType(proofTypeInstances[5].address)
	]);
};
