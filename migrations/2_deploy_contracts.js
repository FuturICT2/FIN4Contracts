const Fin4Main = artifacts.require('Fin4Main');
const ProofDummy = artifacts.require('ProofDummy');

module.exports = function (deployer) {
	deployer.deploy(Fin4Main);
	deployer.deploy(ProofDummy);
};
