pragma solidity ^0.5.0;

import "contracts/Fin4Token.sol";

contract Fin4BaseProofType {

  string private name;
  string private  description;
  string private requirements;

  constructor(string memory _name, string memory _description, string memory _requirements) public {
      name = _name;
      description = _description;
      requirements = _requirements;
    }

  function getName() public view returns(string memory) {
    return name;
  }

  function getDescription() public view returns(string memory) {
    return description;
  }

  function getRequirements() public view returns(string memory) {
    return requirements;
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
