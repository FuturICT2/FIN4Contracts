pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4Proving.sol";

contract Idea is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "Idea";
      description = "Submit an idea."; // TODO better description?
    }

    address public Fin4ProvingAddress;

    function setFin4ProvingAddress(address Fin4ProvingAddr) public {
        Fin4ProvingAddress = Fin4ProvingAddr;
    }

    function submitProof(address tokenAddrToReceiveProof, uint claimId, string memory idea) public {
        Fin4Proving(Fin4ProvingAddress).addSubmission(address(this), tokenAddrToReceiveProof, msg.sender, now, 0, idea);
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
    }

}
