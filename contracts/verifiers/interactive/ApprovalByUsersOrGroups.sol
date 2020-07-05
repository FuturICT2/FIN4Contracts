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

    struct PendingRequest {
        uint pendingRequestId;
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

        string attachment;
        // uint linkedWithPendingRequestId;
    }

    uint public nextPendingRequestId = 0;
    mapping (uint => PendingRequest) public pendingRequests; // just use an array? TODO

    function addPendingRequest(address user, address tokenAddrToReceiveVerifierNotice, uint claimId, string memory attachment)
        internal returns(uint) {
        PendingRequest memory pa;
        pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = user;
        pa.pendingRequestId = nextPendingRequestId;
        pa.isDecided = false;
        pa.attachment = attachment;
        // Must move it to storage like this before pushing into arrays like this:
        // pendingRequests[nextPendingRequestId].messageReceivers.push(...) below.
        // This doesn't work: pa.messageReceivers.push(...), neither does this: pa.messageReceivers[count] = ...
        pendingRequests[nextPendingRequestId] = pa;
        nextPendingRequestId ++;
        return nextPendingRequestId - 1;
    }

    function submitProof(address user, address tokenAddrToReceiveVerifierNotice, uint claimId, string memory attachment,
        string memory pendingNotice) internal {
        uint pendingRequestId = addPendingRequest(user, tokenAddrToReceiveVerifierNotice, claimId, attachment);

        // SEND REQUESTS
        string memory message = string(abi.encodePacked(
            "You are one of the appointed approvers for claims on the token ", Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name(),
            ". Once one approver gives their decision, this message gets marked as read for all others and they can't change the decision anymore."));
            // TODO split into two types of message explaining if you got this directly or via group membership (mention group by name)

        // Individual approvers
        address[] memory individualApprovers = tokenToIndividualApprovers[tokenAddrToReceiveVerifierNotice];
        for (uint i = 0; i < individualApprovers.length; i ++) {
            require(individualApprovers[i] != user, "Claimer is listed as individual approver, no self-approval allowed");
            pendingRequests[pendingRequestId].messageReceivers.push(individualApprovers[i]);
            pendingRequests[pendingRequestId].messageIds.push(Fin4Messaging(Fin4MessagingAddress)
                .addPendingRequestMessage(user, contractName, individualApprovers[i], message, pendingRequests[pendingRequestId].attachment, pendingRequestId));
        }

        // Approver groups
        uint[] memory approverGroupIds = tokenToApproverGroupIDs[tokenAddrToReceiveVerifierNotice];
        for (uint i = 0; i < approverGroupIds.length; i ++) {
            address[] memory groupMembers = Fin4Groups(Fin4GroupsAddress).getGroupMembers(approverGroupIds[i]);
            for (uint j = 0; j < groupMembers.length; j ++) {
                require(groupMembers[j] != user, "Claimer is in at least one of the approver groups, no self-approval allowed");
                pendingRequests[pendingRequestId].messageReceivers.push(groupMembers[j]);
                pendingRequests[pendingRequestId].messageIds.push(Fin4Messaging(Fin4MessagingAddress)
                    .addPendingRequestMessage(user, contractName, groupMembers[j], message, pendingRequests[pendingRequestId].attachment, pendingRequestId));
            }
        }

        // #ConceptualDecision TODO require(pendingRequests[pendingRequestId].messageReceivers.length > 0, "") ?
        // or allow the case that no one gets notified about a new claim? Can happen when group owner removes all
        // members from an approver group. New members could be added though and can then approve via command line.

        _sendPendingNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, pendingNotice);
    }

    // @Override
    function autoSubmitProof(address user, address tokenAddrToReceiveVerifierNotice, uint claimId) public {
        submitProof(user, tokenAddrToReceiveVerifierNotice, claimId, "",
            "The appointed approvers have been notified about your approval request.");
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address[]:Users:addresses comma separated,uint[]:Groups:IDs comma separated";
    }

    mapping (address => address[]) public tokenToIndividualApprovers;
    mapping (address => uint[]) public tokenToApproverGroupIDs;

    function setParameters(address token, address[] memory individualApprovers, uint[] memory approverGroupIDs) public {
        for (uint i = 0; i < approverGroupIDs.length; i ++) {
            require(Fin4Groups(Fin4GroupsAddress).groupExists(approverGroupIDs[i]), "At least one of the approver group IDs does not exist");
        }
        tokenToIndividualApprovers[token] = individualApprovers;
        tokenToApproverGroupIDs[token] = approverGroupIDs;
    }

    function receiveApproval(uint pendingRequestId, string memory attachedMessage) public {
        receiveDecision(pendingRequestId, attachedMessage, true);
    }

    function receiveRejection(uint pendingRequestId, string memory attachedMessage) public {
        receiveDecision(pendingRequestId, attachedMessage, false);
    }

    function receiveDecision(uint pendingRequestId, string memory attachedMessage, bool approved) internal {
        PendingRequest memory pa = pendingRequests[pendingRequestId];
         // only possible if the claimer got added to an approver group after he made the claim
        require(pa.requester != msg.sender, "No self-approve allowed");
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
                "One of the appointed approvers has rejected your approval request for ",
                Fin4TokenBase(token).name()));
            if (bytes(attachedMessage).length > 0) {
                message = string(abi.encodePacked(message, ': ', attachedMessage));
            }
            _sendRejectionNotice(address(this), token, pa.claimIdOnTokenToReceiveVerifierDecision, message);
        }
    }

    function isIndividualApprover(address token, address user) internal returns(bool) {
        address[] memory individualApprovers = tokenToIndividualApprovers[token];
        for (uint i = 0; i < individualApprovers.length; i ++) {
            if (individualApprovers[i] == user) {
                return true;
            }
        }
        return false;
    }
}
