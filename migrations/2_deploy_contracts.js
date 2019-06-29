const Fin4Main = artifacts.require('Fin4Main');
const ImmediateAutoApproval = artifacts.require('ImmediateAutoApproval');
const ApprovalByTokenCreator = artifacts.require('ApprovalByTokenCreator');
const ApprovalBySpecificAddress = artifacts.require('ApprovalBySpecificAddress');

module.exports = async function (deployer) {

	// via https://ethereum.stackexchange.com/a/30579

	// TODO make a nice loop here through all ProofTypes in /contracts/proof without having to list them specifically?

	await Promise.all([
		deployer.deploy(ImmediateAutoApproval),
		deployer.deploy(ApprovalByTokenCreator),
		deployer.deploy(ApprovalBySpecificAddress),
		deployer.deploy(Fin4Main)
	  ]);

	var instances = await Promise.all([
		ImmediateAutoApproval.deployed(),
		ApprovalByTokenCreator.deployed(),
		ApprovalBySpecificAddress.deployed(),
		Fin4Main.deployed()
	])

	await Promise.all([
		instances[3].addProofType(instances[0].address),
		instances[3].addProofType(instances[1].address),
		instances[3].addProofType(instances[2].address),
	]);
};
