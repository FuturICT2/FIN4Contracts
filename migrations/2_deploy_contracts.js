const Fin4Main = artifacts.require('Fin4Main');
const Fin4Claim = artifacts.require('Fin4Claim');
const ProofDummy = artifacts.require('ProofDummy');

module.exports = function (deployer) {
	deployer.deploy(Fin4Main);
	deployer.deploy(Fin4Claim);
	deployer.deploy(ProofDummy);
};
