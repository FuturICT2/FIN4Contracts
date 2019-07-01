pragma solidity ^0.5.0;

contract ApprovalByOneAddress {

  struct PendingApproval {
    address tokenAdrToReceiveProof;
    uint claimIdOnTokenToReceiveProof;
    address requester;
    address approver;
  }

  // this assumes only one pending approval per address, TODO value must be an array
  mapping (address => PendingApproval) public pendingApprovals;

  function _sendApproval(address tokenAdrToReceiveProof, uint claimId) internal returns(bool);

  function receiveApprovalFromSpecificAddress() public returns(bool) {
    require(pendingApprovals[msg.sender].approver == msg.sender, "This address is not registered as approver for any pending approval");
    _sendApproval(pendingApprovals[msg.sender].tokenAdrToReceiveProof, pendingApprovals[msg.sender].claimIdOnTokenToReceiveProof);
    return true;
  }

}
