pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/proof/modules/ApprovalByOneAddress.sol";

contract ApprovalByTokenCreator is Fin4BaseProofType, ApprovalByOneAddress {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType("ApprovalByTokenCreator", "The token creator has to approve", Fin4MainAddress)
    public {}

  function submitProof(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
    address tokenCreator = getCreatorOfToken(tokenAdrToReceiveProof);
    PendingApproval storage pa = pendingApprovals[tokenCreator];
    pa.tokenAdrToReceiveProof = tokenAdrToReceiveProof;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = tokenCreator;
    Fin4MainStrut(Fin4Main).addMessage(msg.sender, tokenCreator, "You were requested to approve a proof type", address(this));
    return true;
  }

  function receiveApprovalFromSpecificAddress() public returns(bool) {
    require(pendingApprovals[msg.sender].approver == msg.sender, "This address is not registered as approver for any pending approval");
    _sendApproval(pendingApprovals[msg.sender].tokenAdrToReceiveProof, pendingApprovals[msg.sender].claimIdOnTokenToReceiveProof);
    return true;
  }

}
