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

  function submitProof(address proofTypeAdrToReceiveProof, uint claimId) public returns(bool) {
    // TODO method in SC deriving from this one
    Fin4Token(proofTypeAdrToReceiveProof).receiveProofApproval(msg.sender, claimId);
    return true;
  }

}
