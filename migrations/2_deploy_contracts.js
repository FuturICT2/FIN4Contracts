const Fin4Main = artifacts.require('Fin4Main');

module.exports = function (deployer) {
	deployer.deploy(Fin4Main);
	deployer.deploy(Fin4Claim);
};
