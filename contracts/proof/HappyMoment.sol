pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4Proving.sol";

contract HappyMoment is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "HappyMoment";
      description = "Submit a picture of a happy moment.";
    }

    address public Fin4ProvingAddress;

    function setFin4ProvingAddress(address Fin4ProvingAddr) public {
        Fin4ProvingAddress = Fin4ProvingAddr;
    }

    function submitProof(address tokenAddrToReceiveProof, uint claimId, string memory IPFShash) public {
        Fin4Proving(Fin4ProvingAddress).addSubmission(address(this), tokenAddrToReceiveProof, msg.sender, now, 1, IPFShash);
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
    }

}
