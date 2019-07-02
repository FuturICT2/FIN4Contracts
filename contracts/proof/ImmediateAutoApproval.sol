pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract ImmediateAutoApproval is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "ImmediateAutoApproval";
      description = "Sends the approval immediately, no checks";
    }

    function submitProof(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
      _sendApproval(tokenAdrToReceiveProof, claimId);
      return true;
    }

}
