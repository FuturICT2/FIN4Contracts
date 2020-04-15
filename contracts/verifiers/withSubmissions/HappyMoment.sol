pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4Verifying.sol";

contract HappyMoment is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "HappyMoment";
      description = "Submit a picture of a happy moment.";
    }

    address public Fin4VerifyingAddress;

    function setFin4VerifyingAddress(address Fin4VerifyingAddr) public {
        Fin4VerifyingAddress = Fin4VerifyingAddr;
    }

    function submitProof(address tokenAddrToReceiveProof, uint claimId, string memory IPFShash) public {
        Fin4Verifying(Fin4VerifyingAddress).addSubmission(address(this), tokenAddrToReceiveProof, msg.sender, now, 1, IPFShash);
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
    }

}
