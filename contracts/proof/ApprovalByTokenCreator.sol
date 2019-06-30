pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract ApprovalByTokenCreator is Fin4BaseProofType {

  constructor()
    Fin4BaseProofType("ApprovalByTokenCreator", "The token creator has to approve")
    public {}

    function submitProof(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
      return true;
    }

}
