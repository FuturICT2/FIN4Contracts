pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";

contract SelfApprove is Fin4BaseVerifierType {

   constructor() public  {
      name = "SelfApprove";
      description = "Claimers approve their own claim.";
    }

    function submitProof_SelfApprove(address tokenAddrToReceiveVerifierNotice, uint claimId) public {
      _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "");
    }

}
