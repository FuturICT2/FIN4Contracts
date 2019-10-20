pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract SelfApprove is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "SelfApprove";
      description = "Claimers approve their own claim.";
    }

    function submitProof_SelfApprove(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
      _sendApproval(address(this), tokenAdrToReceiveProof, claimId);
      return true;
    }

}
