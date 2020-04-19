pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";

contract SelfApprove is Fin4BaseVerifierType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseVerifierType(Fin4MessagingAddress)
    public {
      name = "SelfApprove";
      description = "Claimers approve their own claim.";
    }

    function submitProof_SelfApprove(address tokenAddrToReceiveVerifierDecision, uint claimId) public {
      _sendApproval(address(this), tokenAddrToReceiveVerifierDecision, claimId);
    }

}
