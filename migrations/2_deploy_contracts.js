var KISSConversationToken = artifacts.require("KISSConversationToken");
var ProofDummy = artifacts.require("ProofDummy");

module.exports = function(deployer) {
  deployer.deploy(KISSConversationToken);
  deployer.deploy(ProofDummy);
};