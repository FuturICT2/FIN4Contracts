pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4TokenBase.sol";

contract SpecificAddress is Fin4BaseVerifierType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseVerifierType(Fin4MessagingAddress)
    public {
      init();
    }

  function init() public {
    name = "SpecificAddress";
    description = "The claimer specifies an address, which has to approve.";
  }

  // Holds the info of a pending approval: who should approve what on which token
  // Get's displayed on the frontend as message
  struct PendingApproval {
    address tokenAddrToReceiveVerifierDecision;
    uint claimIdOnTokenToReceiveProof;
    address requester;
    address approver;
    string attachment;
    uint messageId;
    bool isApproved;
    address linkedWith; // key in pendingApprovals that is linked with this one. only if both are approved, send the overall approval
    uint pendingApprovalId;
    uint linkedWithPendingApprovalId;
  }

  mapping (address => PendingApproval[]) public pendingApprovals;

  function submitProof_SpecificAddress(address tokenAddrToReceiveVerifierDecision, uint claimId, address approver) public {
    PendingApproval memory pa;
    pa.tokenAddrToReceiveVerifierDecision = tokenAddrToReceiveVerifierDecision;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;

    pa.pendingApprovalId = pendingApprovals[approver].length;

    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAddrToReceiveVerifierDecision).name()));
    pa.messageId = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(msg.sender, name, approver, message, "", pa.pendingApprovalId);

    pendingApprovals[approver].push(pa);
  }

  function getMessageText() public pure returns(string memory) {
    return "You were requested to approve the proof type SpecificAddress on the token ";
  }

  function receiveApprovalFromSpecificAddress(uint pendingApprovalId) public {
    PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
    require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
    Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);
    _sendApproval(address(this), pa.tokenAddrToReceiveVerifierDecision, pa.claimIdOnTokenToReceiveProof);
  }

  function receiveRejectionFromSpecificAddress(uint pendingApprovalId) public {
    PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
    require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
    Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);

    string memory message = string(abi.encodePacked("User ", addressToString(pa.approver),
      " has rejected your approval request for ", Fin4TokenBase(pa.tokenAddrToReceiveVerifierDecision).name()));
    Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), pa.requester, message);

    // TODO verify this workflow makes sense
    _sendRejection(address(this), pa.tokenAddrToReceiveVerifierDecision, pa.claimIdOnTokenToReceiveProof);

    // TODO boolean flag in PendingApproval? #ConceptualDecision
  }

}
