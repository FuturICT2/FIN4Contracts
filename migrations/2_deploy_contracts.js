var Fin4BaseToken = artifacts.require("Fin4BaseToken");
var ProofDummy = artifacts.require("ProofDummy");

module.exports = function(deployer) {
  deployer.deploy(Fin4BaseToken);
  deployer.deploy(ProofDummy);
};
