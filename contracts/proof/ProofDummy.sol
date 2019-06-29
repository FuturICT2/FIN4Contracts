pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract ProofDummy is Fin4BaseProofType {

  constructor()
    Fin4BaseProofType("Proof Dummy", "For dev", "initProofSubmission:")
    public {}

    function initProofSubmission(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
        // _sendApproval(tokenAdrToReceiveProof, msg.sender);
        return true;
    }

}
