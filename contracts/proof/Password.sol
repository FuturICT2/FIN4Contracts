pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Password is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "Password";
      description = "A numeric password (PIN), which the token creator set, needs to be provided.";
    }

    // TODO support string parameters to be able to use a string-password here
    function submitProof_Password(address tokenAddrToReceiveProof, uint claimId, string memory password) public returns(bool) {
      // via https://ethereum.stackexchange.com/a/30914
      if (keccak256(abi.encodePacked((password))) == keccak256(abi.encodePacked((_getPassword(tokenAddrToReceiveProof))))) {
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
          Fin4TokenStub(tokenAddrToReceiveProof).name(),
          ": The password you provided is not matching the one set by the token creator."
        ));
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), msg.sender, message);
      }
      return true;
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
      return tokenToParameter[token]; // TODO this must not be visible to someone using truffle console or similar!
    }

}
