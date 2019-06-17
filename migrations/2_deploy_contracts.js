var Fin4BaseToken = artifacts.require('Fin4BaseToken');
var ProofDummy = artifacts.require('ProofDummy');

module.exports = function(deployer) {
	var name = 'Fin4 Base Token';
	var symbol = 'FIN4';
	var decimals = 18;

	deployer.deploy(Fin4BaseToken, name, symbol, decimals);
	deployer.deploy(ProofDummy);
};
