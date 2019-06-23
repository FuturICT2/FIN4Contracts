pragma solidity ^0.5.0;

import "contracts/Fin4Token.sol";

contract ProofDummy {

  function submitProof(address SCtoReceiveProof, uint claimId) public returns(bool) {
    Fin4Token(SCtoReceiveProof).receiveProofApproval(msg.sender, claimId);
    return true;
  }

}
