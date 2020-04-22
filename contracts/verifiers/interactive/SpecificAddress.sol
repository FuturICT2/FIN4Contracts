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
    address tokenAddrToReceiveVerifierNotice;
    uint claimIdOnTokenToReceiveVerifierDecision;
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

  function submitProof_SpecificAddress(address tokenAddrToReceiveVerifierNotice, uint claimId, address approver) public {
    PendingApproval memory pa;
    pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
    pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;

    pa.pendingApprovalId = pendingApprovals[approver].length;

    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name()));
    pa.messageId = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(msg.sender, name, approver, message, "", pa.pendingApprovalId);

    pendingApprovals[approver].push(pa);

    _sendPendingNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId);
  }

  function getMessageText() public pure returns(string memory) {
    return "You were requested to approve the verifier type SpecificAddress on the token ";
  }

  function receiveApprovalFromSpecificAddress(uint pendingApprovalId) public {
    PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
    require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
    Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);
    _sendApprovalNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, "");
  }

  function receiveRejectionFromSpecificAddress(uint pendingApprovalId) public {
    PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
    require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
    Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);

    string memory message = string(abi.encodePacked("User ", addressToString(pa.approver),
      " has rejected your approval request for ", Fin4TokenBase(pa.tokenAddrToReceiveVerifierNotice).name()));
    _sendRejectionNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, message);

    // TODO boolean flag in PendingApproval? #ConceptualDecision
  }

}
