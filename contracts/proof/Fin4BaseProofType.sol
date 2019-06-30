pragma solidity ^0.5.0;

import "contracts/Fin4Token.sol";

contract Fin4BaseProofType {

  string private name;
  string private description;

  constructor(string memory _name, string memory _description) public {
      name = _name;
      description = _description;
    }

  function getName() public view returns(string memory) {
    return name;
  }

  function getDescription() public view returns(string memory) {
    return description;
  }

  function _sendApproval(address tokenAdrToReceiveProof, uint claimId) internal returns(bool) {
    // private ensures it can only be called from within this SC?
    Fin4Token(tokenAdrToReceiveProof).receiveProofApproval(msg.sender, claimId);
    return true;
  }

}
