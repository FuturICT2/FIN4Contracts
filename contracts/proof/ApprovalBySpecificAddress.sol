pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract ApprovalBySpecificAddress is Fin4BaseProofType {

  constructor()
    Fin4BaseProofType("ApprovalBySpecificAddress", "The specified address has to approve")
    public {}

  struct PendingApproval {
    address tokenAdrToReceiveProof;
    uint claimIdOnTokenToReceiveProof;
    address requester;
    address approver;
  }

  // this assumes only one pending approval per address, TODO value must be an array
  mapping (address => PendingApproval) public pendingApprovals;

  function submitProof(address tokenAdrToReceiveProof, uint claimId, address approver) public returns(bool) {
    PendingApproval storage pa = pendingApprovals[approver];
    pa.tokenAdrToReceiveProof = tokenAdrToReceiveProof;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;
    return true;
  }

  function receiveApprovalFromSpecificAddress() public returns(bool) {
    require(pendingApprovals[msg.sender].approver == msg.sender, "This address is not registered as approver for any pending approval");
    _sendApproval(pendingApprovals[msg.sender].tokenAdrToReceiveProof, pendingApprovals[msg.sender].claimIdOnTokenToReceiveProof);
    return true;
  }

}
