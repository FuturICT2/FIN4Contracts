pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4Proofing.sol";

contract HappyMoment is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "HappyMoment";
      description = "Submit a picture of a happy moment.";
    }

    address public Fin4ProofingAddress;

    function setFin4ProofingAddress(address Fin4ProofingAddr) public {
        Fin4ProofingAddress = Fin4ProofingAddr;
    }

    function submitProof(address tokenAddrToReceiveProof, uint claimId, string memory IPFShash) public {
        Fin4Proofing(Fin4ProofingAddress).addSubmission(address(this), tokenAddrToReceiveProof, msg.sender, now, 1, IPFShash);
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
    }

}
