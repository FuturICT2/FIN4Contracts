pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4TokenBase.sol";

contract Idea is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "Idea";
      description = "Submit an idea."; // TODO better description?
    }

    function submitProof(address tokenAddrToReceiveProof, uint claimId, string memory idea) public {
        Fin4TokenBase(tokenAddrToReceiveProof).addSubmission(msg.sender, idea);
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
    }

}
