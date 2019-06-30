pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract ApprovalBySpecificAddress is Fin4BaseProofType {

  constructor()
    Fin4BaseProofType("ApprovalBySpecificAddress", "The specified address has to approve")
    public {}

    function submitProof(address tokenAdrToReceiveProof, uint claimId, address approver) public returns(bool) {
      return true;
    }

}
