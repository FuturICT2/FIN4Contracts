pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4TokenBase.sol";
import "contracts/Fin4Messaging.sol";

contract SpecificAddress is Fin4BaseVerifierType {

    constructor() public {
        // gets called by overwriting classes
        init();
    }

    function init() public {
        name = "sc.verifier.specific-address.name";
        description = "sc.verifier.specific-address.description";
    }

    address public Fin4MessagingAddress;

    function setFin4MessagingAddress(address Fin4MessagingAddr) public {
        Fin4MessagingAddress = Fin4MessagingAddr;
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
        require(msg.sender != approver, "Self-approval is not allowed.");
        PendingApproval memory pa;
        pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = msg.sender;
        pa.approver = approver;

        pa.pendingApprovalId = pendingApprovals[approver].length;

        string memory message = string(abi.encodePacked(getMessageText(),
            Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name()));
        pa.messageId = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(
            msg.sender, contractName, approver, message, "", pa.pendingApprovalId);

        pendingApprovals[approver].push(pa);

        _sendPendingNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "Your approver has been notified about the request.");
    }

    function getMessageText() public pure returns(string memory) {
        return "You were requested to approve the verifier type SpecificAddress on the token ";
    }

    function receiveApprovalFromSpecificAddress(uint pendingApprovalId, string memory attachedMessage) public {
        PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
        require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
        Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);
        _sendApprovalNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, attachedMessage);
    }

    function receiveRejectionFromSpecificAddress(uint pendingApprovalId, string memory attachedMessage) public {
        PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
        require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
        Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);

        string memory message = string(abi.encodePacked("User ", addressToString(pa.approver),
            " has rejected your approval request for ", Fin4TokenBase(pa.tokenAddrToReceiveVerifierNotice).name()));

        if (bytes(attachedMessage).length > 0) {
            message = string(abi.encodePacked(message, ': ', attachedMessage));
        }

        _sendRejectionNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, message);

        // TODO boolean flag in PendingApproval? #ConceptualDecision
    }

}
