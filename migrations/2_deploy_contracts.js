var KISSConversationToken = artifacts.require("KISSConversationToken");
var ProofDummy = artifacts.require("ProofDummy");
//var HelloWorld = artifacts.require("HelloWorld");

module.exports = function(deployer) {
  deployer.deploy(KISSConversationToken);
  deployer.deploy(ProofDummy);
  //deployer.deploy(HelloWorld, "hello");
};