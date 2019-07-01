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

}
