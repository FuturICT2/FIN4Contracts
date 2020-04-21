pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Verifying.sol";

contract Idea is Fin4BaseVerifierType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseVerifierType(Fin4MessagingAddress)
    public {
      name = "Idea";
      description = "Submit an idea."; // TODO better description?
    }

    address public Fin4VerifyingAddress;

    function setFin4VerifyingAddress(address Fin4VerifyingAddr) public {
        Fin4VerifyingAddress = Fin4VerifyingAddr;
    }

    function submitProof(address tokenAddrToReceiveVerifierDecision, uint claimId, string memory idea) public {
        Fin4Verifying(Fin4VerifyingAddress).addSubmission(address(this), tokenAddrToReceiveVerifierDecision, msg.sender, now, 0, idea);
        _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierDecision, claimId);
    }

}
