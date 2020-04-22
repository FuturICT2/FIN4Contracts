pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Verifying.sol";

contract HappyMoment is Fin4BaseVerifierType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseVerifierType(Fin4MessagingAddress)
    public {
      name = "HappyMoment";
      description = "Submit a picture of a happy moment.";
    }

    address public Fin4VerifyingAddress;

    function setFin4VerifyingAddress(address Fin4VerifyingAddr) public {
        Fin4VerifyingAddress = Fin4VerifyingAddr;
    }

    function submitProof(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory IPFShash) public {
        Fin4Verifying(Fin4VerifyingAddress).addSubmission(address(this), tokenAddrToReceiveVerifierNotice, msg.sender, now, 1, IPFShash);
        _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "");
    }

}
