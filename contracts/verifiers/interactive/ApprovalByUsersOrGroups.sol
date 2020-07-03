pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4TokenBase.sol";
import "contracts/Fin4Groups.sol";
import "contracts/Fin4Messaging.sol";

contract ApprovalByUsersOrGroups is Fin4BaseVerifierType {

    constructor() public {
        init();
    }

    address public Fin4GroupsAddress;
    address public Fin4MessagingAddress;
    function setFin4GroupsAddress(address Fin4GroupsAddr) public { Fin4GroupsAddress = Fin4GroupsAddr; }
    function setFin4MessagingAddress(address Fin4MessagingAddr) public { Fin4MessagingAddress = Fin4MessagingAddr; }

    function init() public {
        name = "sc.verifier.approval-by-users-or-groups.name";
        description = "sc.verifier.approval-by-users-or-groups.description";
        isAutoInitiable = true;
    }

    struct PendingApproval {
        uint pendingApprovalId;
        address tokenAddrToReceiveVerifierNotice;
        uint claimIdOnTokenToReceiveVerifierDecision;
        address requester;

        // This is the list of approvers at the time of sending out the request.
        // Group memberships might change until a decision by the first-responder
        // is made. This list is only to be able to mark all messages that were
        // sent out as read once a decision is made.
        address[] messageReceivers;
        uint[] messageIds;

        bool isDecided;

        // string attachment;
        // uint linkedWithPendingApprovalId;
    }

    uint public nextPendingApprovalId = 0;
    mapping (uint => PendingApproval) public pendingApprovals; // just use an array? TODO

    // @Override
    function autoSubmitProof(address user, address tokenAddrToReceiveVerifierNotice, uint claimId) public {
        PendingApproval memory pa;
        pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = user;
        pa.pendingApprovalId = nextPendingApprovalId;
        pa.isDecided = false;

        string memory message = string(abi.encodePacked(
            "You are one of the appointed approvers for claims on the token ", Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name(),
            ". Once one approver gives their decision, this message gets marked as read for all others and they can't change the decision anymore."));
        // TODO split into two types of message explaining if you got this directly or via group membership (mention group by name)

        uint count = 0;

        // INDIVIDUAL APPROVERS
        address[] individualApprovers = tokenToIndividualApprovers[token];
        for (uint i = 0; i < individualApprovers.length; i ++) {
            pa.messageReceivers[count] = individualApprovers[i];
            pa.messageIds[count] = Fin4Messaging(Fin4MessagingAddress)
                .addPendingApprovalMessage(user, contractName, individualApprovers[i], message, "", pa.pendingApprovalId);
            count ++;
        }

        // APPROVER GROUPS
        uint[] approverGroupIds = tokenToApproverGroupIDs[token];
        for (uint i = 0; i < approverGroupIds.length; i ++) {
            address[] memory groupMembers = Fin4Groups(Fin4GroupsAddress).getGroupMembers(approverGroupIds[i]);
            for (uint j = 0; j < groupMembers.length; j ++) {
                pa.messageReceivers[count] = groupMembers[j];
                pa.messageIds[count] = Fin4Messaging(Fin4MessagingAddress)
                    .addPendingApprovalMessage(user, contractName, groupMembers[j], message, "", pa.pendingApprovalId);
                count ++;
            }
        }

        pendingApprovals[nextPendingApprovalId] = pa;
        nextPendingApprovalId ++;

        _sendPendingNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId,
            "The appointed approvers have been notified about your approval request.");
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address[]:Individual approvers:comma separated,uint[]:Approver groups:Group IDs comma separated";
    }

    mapping (address => address[]) public tokenToIndividualApprovers;
    mapping (address => uint[]) public tokenToApproverGroupIDs;

    function setParameters(address token, address[] individualApprovers, uint[] approverGroupIDs) public {
        for (uint i = 0; i < approverGroupIDs.length; i ++) {
            require(Fin4Groups(Fin4GroupsAddress).groupExists(approverGroupIDs[i]), "At least one of the approver group IDs does not exist");
        }
        tokenToIndividualApprovers[token] = individualApprovers;
        tokenToApproverGroupIDs[token] = approverGroupIDs;
    }

    function receiveApproval(uint pendingApprovalId, string memory attachedMessage) public {
        receiveDecision(pendingApprovalId, attachedMessage, true);
    }

    function receiveRejection(uint pendingApprovalId, string memory attachedMessage) public {
        receiveDecision(pendingApprovalId, attachedMessage, false);
    }

    function receiveDecision(uint pendingApprovalId, string memory attachedMessage, bool approved) internal {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        address token = pa.tokenAddrToReceiveVerifierNotice;
        bool userHasPermission = isIndividualApprover(token, msg.sender) ||
            Fin4Groups(Fin4GroupsAddress).userIsInOneOfTheseGroups(tokenToApproverGroupIDs[token], msg.sender);
        require(userHasPermission, "You don't have permission to decide on this request");
        require(!pa.isDecided, "This request is already decided");

        for (uint i = 0; i < pa.messageIds.length; i ++) {
            Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(pa.messageReceivers[i], pa.messageIds[i]);
        }

        pa.isDecided = true;

        if (approved) {
            _sendApprovalNotice(address(this), token, pa.claimIdOnTokenToReceiveVerifierDecision, attachedMessage);
        } else {
            string memory message = string(abi.encodePacked(
                "A member of the appointed approver group has rejected your approval request for ",
                Fin4TokenBase(token).name()));
            if (bytes(attachedMessage).length > 0) {
                message = string(abi.encodePacked(message, ': ', attachedMessage));
            }
            _sendRejectionNotice(address(this), token, pa.claimIdOnTokenToReceiveVerifierDecision, message);
        }
    }

    function isIndividualApprover(address token, address user) internal returns(bool) {
        address[] individualApprovers = tokenToIndividualApprovers[token];
        for (uint i = 0; i < individualApprovers.length; i ++) {
            if (individualApprovers[i] == user) {
                return true;
            }
        }
        return false;
    }
}
