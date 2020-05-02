pragma solidity ^0.5.17;

import "contracts/verifiers/interactive/ApprovalByGroupMember.sol";

contract SelfieTogether is ApprovalByGroupMember {

    constructor() public {}

    // @Override
    function init() public {
        name = "SelfieTogether";
        description = "The claimer supplies a picture, based on which a self-chosen approver and a member of a group of users appointed by the token creator decide to approve.";
    }

    function submitProof_SelfieTogether(address tokenAddrToReceiveVerifierNotice, uint claimId, address approver,
        string memory IPFShash) public {

        // to user-chosen approver
        PendingApproval memory pa;
        pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = msg.sender;
        pa.groupMemberAddresses = new address[](1);
        pa.groupMemberAddresses[0] = approver;
        pa.attachment = IPFShash;
        pa.pendingApprovalId = nextPendingApprovalId;
        pa.isIndividualApprover = true;

        string memory message = string(abi.encodePacked(getMessageText(),
            Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name()));
        pa.messageIds = new uint[](1);
        pa.messageIds[0] = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(
            msg.sender, name, approver, message, IPFShash, pa.pendingApprovalId);

        pendingApprovals[nextPendingApprovalId] = pa;
        nextPendingApprovalId ++;

        // to approver-group set by token-creator

        PendingApproval memory paG;
        paG.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        paG.claimIdOnTokenToReceiveVerifierDecision = claimId;
        paG.requester = msg.sender;
        uint groupId = _getGroupId(tokenAddrToReceiveVerifierNotice);
        paG.approverGroupId = groupId;
        paG.attachment = IPFShash;
        paG.pendingApprovalId = nextPendingApprovalId;
        paG.isIndividualApprover = false;

        string memory messageG = string(abi.encodePacked(getMessageTextForGroupMember(), Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name(),
            ". Once a member of the group approves, these messages get marked as read for all others."));

        address[] memory members = Fin4Groups(Fin4GroupsAddress).getGroupMembers(groupId);

        paG.groupMemberAddresses = new address[](members.length);
        paG.messageIds = new uint[](members.length);
        for (uint i = 0; i < members.length; i ++) {
            paG.groupMemberAddresses[i] = members[i];
            paG.messageIds[i] = Fin4Messaging(Fin4MessagingAddress)
                .addPendingApprovalMessage(msg.sender, name, members[i], messageG, IPFShash, paG.pendingApprovalId);
        }

        pendingApprovals[nextPendingApprovalId] = paG;
        nextPendingApprovalId ++;

        // connect the two PendingApprovals
        pa.isApproved = false;
        paG.isApproved = false;
        pa.linkedWithPendingApprovalId = paG.pendingApprovalId;
        paG.linkedWithPendingApprovalId = pa.pendingApprovalId;

        _sendPendingNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId);
    }

    // @Override
    function getMessageText() public pure returns(string memory) {
        return "Please check this selfie and approve it if you are in it: ";
    }

    function getMessageTextForGroupMember() public pure returns(string memory) {
        return "As a member of the appointed approval group, please check this selfie and approve it: ";
    }

    // @Override
    function receiveApprovalFromSpecificAddress(uint pendingApprovalId, string memory attachedMessage) public {
        PendingApproval storage pa = pendingApprovals[pendingApprovalId];

        if (pa.isIndividualApprover) {
            require(pa.groupMemberAddresses[0] == msg.sender, "You are not an approver on this instance");
        } else {
            require(Fin4Groups(Fin4GroupsAddress).isMember(pa.approverGroupId, msg.sender), "You are not a member of the appointed approver group");
        }

        markMessagesAsRead(pendingApprovalId); // works for both individual and group
        pa.isApproved = true;

        if (pendingApprovals[pa.linkedWithPendingApprovalId].isApproved) {
            _sendApprovalNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, attachedMessage);
        }
    }

    function receiveRejectionFromSpecificAddress(uint pendingApprovalId, string memory attachedMessage) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        string memory message;

        if (pa.isIndividualApprover) {
            require(pa.groupMemberAddresses[0] == msg.sender, "You are not an approver on this instance");
            message = string(abi.encodePacked(
                "The user you appointed for approving your selfie has rejected your request for ",
                Fin4TokenBase(pa.tokenAddrToReceiveVerifierNotice).name()));
        } else {
            require(Fin4Groups(Fin4GroupsAddress).isMember(pa.approverGroupId, msg.sender), "You are not a member of the appointed approver group");
            markMessagesAsRead(pendingApprovalId);
            message = string(abi.encodePacked(
                "A member of the appointed approver group has rejected your approval request for ",
                Fin4TokenBase(pa.tokenAddrToReceiveVerifierNotice).name()));
        }

        if (bytes(attachedMessage).length > 0) {
            message = string(abi.encodePacked(message, ': ', attachedMessage));
        }

        _sendRejectionNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, message);
    }

}
