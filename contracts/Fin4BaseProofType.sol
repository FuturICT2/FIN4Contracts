pragma solidity ^0.5.0;

import "contracts/Fin4Token.sol";

contract Fin4BaseProofType {

  string public name;
  string public description;

  constructor(string memory _name, string memory _description)
    public {
      _name = name;
      _description = description;
    }

  function getName() public returns(string memory) {
    return name;
  }

  function getDescription() public returns(string memory) {
    return description;
  }

  function _sendApproval(address tokenAdrToReceiveProof, address claimer, uint claimId) private returns(bool) {
    // private ensures it can only be called from within this SC?
    Fin4Token(tokenAdrToReceiveProof).receiveProofApproval(msg.sender, claimId);
    return true;
  }

  function _sendDisapproval(address tokenAdrToReceiveProof, address claimer, uint claimId, string memory reason) public returns(bool) {
    // TODO
  }

}
