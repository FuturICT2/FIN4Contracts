pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract ApprovalByTokenCreator is Fin4BaseProofType {

  constructor()
    Fin4BaseProofType("ApprovalByTokenCreator", "The token creator has to approve")
    public {}

    function initProofSubmission(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
        // _sendApproval(tokenAdrToReceiveProof, msg.sender);
        return true;
    }

    function submitProof() public returns(bool) {
      return true;
    }

}
