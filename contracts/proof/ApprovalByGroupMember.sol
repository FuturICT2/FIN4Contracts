pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4TokenBase.sol";
import "contracts/Fin4Groups.sol";

contract ApprovalByGroupMember is Fin4BaseProofType {

    constructor(address Fin4MessagingAddress)
        Fin4BaseProofType(Fin4MessagingAddress)
        public {
            setNameAndDescription();
        }

    address public Fin4GroupsAddress;

    function setFin4GroupsAddress(address Fin4GroupsAddr) public {
        Fin4GroupsAddress = Fin4GroupsAddr;
    }

    function setNameAndDescription() public returns(bool) {
        name = "ApprovalByGroupMember";
        description = "The token creator specifies one or more user groups, of which one member has to approve.";
    }

    struct MemberMessage {
        address memberAddress;
        uint messageId;
    }

    struct PendingApproval {
        uint pendingApprovalId;
        address tokenAddrToReceiveProof;
        uint claimIdOnTokenToReceiveProof;
        address requester;
        uint approverGroupId;
        MemberMessage[] memberMessages;
    }

    uint public nextPendingApprovalId = 0;
    mapping (uint => PendingApproval) public pendingApprovals; // just use an array? TODO

    function submitProof_ApprovalByGroupMember(address tokenAddrToReceiveProof, uint claimId) public {
        PendingApproval memory pa;
        pa.tokenAddrToReceiveProof = tokenAddrToReceiveProof;
        pa.claimIdOnTokenToReceiveProof = claimId;
        pa.requester = msg.sender;
        uint groupId = _getGroupId(tokenAddrToReceiveProof);
        pa.approverGroupId = groupId;
        pa.pendingApprovalId = nextPendingApprovalId;

        string memory message = string(abi.encodePacked(getMessageText(), Fin4TokenBase(tokenAddrToReceiveProof).name(),
            ". Once a member of the group approves, these messages get marked as read for all others."));

        address[] memory members = Fin4Groups(Fin4GroupsAddress).getGroupMembers(groupId);
        for (uint i = 0; i < members.length; i ++) {
            if (members[i] == address(0)) {
                continue;
            }
            uint messageId = Fin4Messaging(Fin4MessagingAddress)
                .addPendingApprovalMessage(msg.sender, name, members[i], message, "", pa.pendingApprovalId);
            pa.memberMessages[i] = MemberMessage(members[i], messageId);
        }

        pendingApprovals[nextPendingApprovalId] = pa;
        nextPendingApprovalId ++;
    }

    function getMessageText() public pure returns(string memory) {
        return "You are a member of a user group that was appointed for approving this claim on the action type ";
    }

    // @Override
    function getParameterForActionTypeCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:Group Id:can be found in the overview of groups";
    }

    // @Override
    function parametersSanityCheck(uint[] memory params) public view returns(bool) {
        return Fin4Groups(Fin4GroupsAddress).groupExists(params[0]);
    }

    function _getGroupId(address token) private view returns(uint) {
        return fin4TokenToParametersSetOnThisProofType[token][0];
    }

    // copied method signature from SpecificAddress, then nothing has to be changed in Messages.jsx

    function receiveApprovalFromSpecificAddress(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        require(Fin4Groups(Fin4GroupsAddress).isMember(pa.approverGroupId, msg.sender), "You are not a member of the appointed approver group");
        markMessagesAsRead(pendingApprovalId);

        _sendApproval(address(this), pa.tokenAddrToReceiveProof, pa.claimIdOnTokenToReceiveProof);
    }

    function receiveRejectionFromSpecificAddress(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        require(Fin4Groups(Fin4GroupsAddress).isMember(pa.approverGroupId, msg.sender), "You are not a member of the appointed approver group");
        markMessagesAsRead(pendingApprovalId);

        string memory message = string(abi.encodePacked(
            "A member of the appointed approver group has rejected your approval request for ",
            Fin4TokenBase(pa.tokenAddrToReceiveProof).name()));
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), pa.requester, message);
    }

    function markMessagesAsRead(uint pendingApprovalId) private {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        for (uint i = 0; i < pa.memberMessages.length; i ++) {
            Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(
                pa.memberMessages[i].memberAddress,
                pa.memberMessages[i].messageId
            );
        }
    }
}
