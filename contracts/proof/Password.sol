pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Password is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "Password";
      description = "Approval if the user provides the password matching the one the token creator set.";
    }

    function submitProof_Password(address tokenAddrToReceiveProof, uint claimId, string memory password) public {
      // via https://ethereum.stackexchange.com/a/30914
      if (keccak256(abi.encodePacked((password))) == keccak256(abi.encodePacked((_getPassword(tokenAddrToReceiveProof))))) {
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
              "Your claim on token \'",
              Fin4TokenStub(tokenAddrToReceiveProof).name(),
              "\' got rejected from proof type \'Password\' because the password you",
              " provided does not match the one set by the token creator"));
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), msg.sender, message);
        _sendRejection(address(this), tokenAddrToReceiveProof, claimId);
      }
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
      return "string:password:alphanumeric string";
    }

    mapping (address => string) public tokenToParameter;

    function setParameters(address token, string memory password) public {
      tokenToParameter[token] = password;
    }

    function _getPassword(address token) private view returns(string memory) {
      // TODO this must not be visible to someone using truffle console or similar!
      // Use a salt additionally? Or encrypt it with itself? Only possible with numbers (as done in TCR?) #ConceptualDecision
      return tokenToParameter[token];
    }

}
