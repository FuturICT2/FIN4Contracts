pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Verifying.sol";
import "contracts/Fin4TokenBase.sol";
import "contracts/Fin4Messaging.sol";

contract Networking is Fin4BaseVerifierType {

    constructor() public  {
        name = "sc.verifier.networking.name";
        description = "sc.verifier.networking.description";
    }

    address public Fin4VerifyingAddress;
    address public Fin4MessagingAddress;

    function setFin4VerifyingAddress(address Fin4VerifyingAddr) public {
        Fin4VerifyingAddress = Fin4VerifyingAddr;
    }

    function setFin4MessagingAddress(address Fin4MessagingAddr) public {
        Fin4MessagingAddress = Fin4MessagingAddr;
    }

    struct PendingApproval {
        uint pendingApprovalId;
        address tokenAddrToReceiveVerifierNotice;
        uint claimIdOnTokenToReceiveVerifierDecision;
        address requester;
        address approver;
        string attachment;
        uint messageId;
        bool isApproved;
        uint timestamp;
    }

    mapping (address => PendingApproval[]) public pendingApprovals;

    function submitProof(address tokenAddrToReceiveVerifierNotice, uint claimId, address approver, string memory content) public {
        PendingApproval memory pa;
        pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = msg.sender;
        pa.approver = approver;
        pa.pendingApprovalId = pendingApprovals[approver].length;
        pa.timestamp = now;
        pa.attachment = content;

        string memory message = string(abi.encodePacked(
            "You were requested to approve a networking claim on the token '",
            Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name(),
            "'. The submitted content is '", content, "'."));

        pa.messageId = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(
            msg.sender, name, approver, message, content, pa.pendingApprovalId);

        pendingApprovals[approver].push(pa);
    }

    function receiveApprovalFromSpecificAddress(uint pendingApprovalId, string memory attachedMessage) public {
        PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
        require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
        Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);
        _sendApprovalNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, attachedMessage);
        Fin4Verifying(Fin4VerifyingAddress).addSubmission(
            address(this), pa.tokenAddrToReceiveVerifierNotice, pa.requester, pa.timestamp, 0, pa.attachment);
    }

    function receiveRejectionFromSpecificAddress(uint pendingApprovalId, string memory attachedMessage) public {
        PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
        require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
        Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);
        string memory message = string(abi.encodePacked("Your chosen approver '", addressToString(pa.approver),
            "' has rejected your approval request for the 'Networking' verifier on a claim on token '",
            Fin4TokenBase(pa.tokenAddrToReceiveVerifierNotice).name(), "'"));

        if (bytes(attachedMessage).length > 0) {
            message = string(abi.encodePacked(message, ': ', attachedMessage));
        }
        _sendRejectionNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, message);
    }
}
