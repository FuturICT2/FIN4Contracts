pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4Proofing.sol";

contract Idea is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "Idea";
      description = "Submit an idea."; // TODO better description?
    }

    address public Fin4ProofingAddress;

    function setFin4ProofingAddress(address Fin4ProofingAddr) public {
        Fin4ProofingAddress = Fin4ProofingAddr;
    }

    function submitProof(address tokenAddrToReceiveProof, uint claimId, string memory idea) public {
        uint timestamp = now;
        Fin4Proofing(Fin4ProofingAddress).addSubmission(address(this), tokenAddrToReceiveProof, msg.sender, timestamp, idea);
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
    }

}
