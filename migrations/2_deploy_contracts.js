const Fin4Main = artifacts.require('Fin4Main');
const ImmediateAutoApproval = artifacts.require('ImmediateAutoApproval');
const ApprovalByTokenCreator = artifacts.require('ApprovalByTokenCreator');

module.exports = async function (deployer) {

	// via https://ethereum.stackexchange.com/a/30579

	await Promise.all([
		deployer.deploy(ImmediateAutoApproval),
		deployer.deploy(ApprovalByTokenCreator),
		deployer.deploy(Fin4Main)
	  ]);

	var instances = await Promise.all([
		ImmediateAutoApproval.deployed(),
		ApprovalByTokenCreator.deployed(),
		Fin4Main.deployed()
	])

	await Promise.all([
		instances[2].addProofType(instances[0].address),
		instances[2].addProofType(instances[1].address),
	]);
};
