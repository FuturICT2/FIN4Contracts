pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Verifying.sol";

contract Statement is Fin4BaseVerifierType {

    constructor() public  {
        name = "Statement";
        description = "Submit a statement.";
    }

    address public Fin4VerifyingAddress;

    function setFin4VerifyingAddress(address Fin4VerifyingAddr) public {
        Fin4VerifyingAddress = Fin4VerifyingAddr;
    }

    function submitProof_Statement(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory statement) public {
        Fin4Verifying(Fin4VerifyingAddress).addSubmission(address(this), tokenAddrToReceiveVerifierNotice, msg.sender, now, 0, statement);
        _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, statement);
    }

}
