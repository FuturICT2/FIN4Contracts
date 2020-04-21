pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Verifying.sol";
import "contracts/Fin4TokenBase.sol";

contract Networking is Fin4BaseVerifierType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseVerifierType(Fin4MessagingAddress)
    public {
      name = "Networking";
      description = "Submit content of your networking activity and your counterpart has to approve your claim.";
    }

    address public Fin4VerifyingAddress;

    function setFin4VerifyingAddress(address Fin4VerifyingAddr) public {
        Fin4VerifyingAddress = Fin4VerifyingAddr;
    }

    struct PendingApproval {
        uint pendingApprovalId;
        address tokenAddrToReceiveVerifierDecision;
        uint claimIdOnTokenToReceiveVerifierDecision;
        address requester;
        address approver;
        string attachment;
        uint messageId;
        bool isApproved;
        uint timestamp;
    }

    mapping (address => PendingApproval[]) public pendingApprovals;

    function submitProof(address tokenAddrToReceiveVerifierDecision, uint claimId, address approver, string memory content) public {
        PendingApproval memory pa;
        pa.tokenAddrToReceiveVerifierDecision = tokenAddrToReceiveVerifierDecision;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = msg.sender;
        pa.approver = approver;
        pa.pendingApprovalId = pendingApprovals[approver].length;
        pa.timestamp = now;
        pa.attachment = content;

        string memory message = string(abi.encodePacked(
            "You were requested to approve a networking claim on the token '",
            Fin4TokenBase(tokenAddrToReceiveVerifierDecision).name(),
            "'. The submitted content is '", content, "'."));

        pa.messageId = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(
            msg.sender, name, approver, message, content, pa.pendingApprovalId);

        pendingApprovals[approver].push(pa);
    }

    function receiveApprovalFromSpecificAddress(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
        require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
        Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);
        _sendApprovalNotice(address(this), pa.tokenAddrToReceiveVerifierDecision, pa.claimIdOnTokenToReceiveVerifierDecision);
        Fin4Verifying(Fin4VerifyingAddress).addSubmission(
            address(this), pa.tokenAddrToReceiveVerifierDecision, pa.requester, pa.timestamp, 0, pa.attachment);
    }

    function receiveRejectionFromSpecificAddress(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
        require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
        Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);
        string memory message = string(abi.encodePacked("Your chosen approver '", addressToString(pa.approver),
            "' has rejected your approval request for the 'Networking' verifier on a claim on token '",
            Fin4TokenBase(pa.tokenAddrToReceiveVerifierDecision).name(), "'"));
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), pa.requester, message);
        _sendRejectionNotice(address(this), pa.tokenAddrToReceiveVerifierDecision, pa.claimIdOnTokenToReceiveVerifierDecision);
    }
}
