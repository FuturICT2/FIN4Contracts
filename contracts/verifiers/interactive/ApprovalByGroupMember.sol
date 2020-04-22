pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4TokenBase.sol";
import "contracts/Fin4Groups.sol";

contract ApprovalByGroupMember is Fin4BaseVerifierType {

    constructor(address Fin4MessagingAddress)
        Fin4BaseVerifierType(Fin4MessagingAddress)
        public {
            init();
        }

    address public Fin4GroupsAddress;

    function setFin4GroupsAddress(address Fin4GroupsAddr) public {
        Fin4GroupsAddress = Fin4GroupsAddr;
    }

    function init() public {
        name = "ApprovalByGroupMember";
        description = "The token creator specifies one or more user groups, of which one member has to approve.";
        isAutoInitiable = true;
    }

    struct PendingApproval {
        uint pendingApprovalId;
        address tokenAddrToReceiveVerifierNotice;
        uint claimIdOnTokenToReceiveVerifierDecision;
        address requester;

        bool isIndividualApprover; // false means group-usage

        uint approverGroupId;
        // the following two arrays belong tightly together
        address[] groupMemberAddresses; // store a snapshot of those here or not? #ConceptualDecision
                                        // if not, a mechanism to mark messages as read is needed
        uint[] messageIds;

        string attachment;
        bool isApproved; // in case of multiple PendingApprovals waiting for each other
        uint linkedWithPendingApprovalId;
    }

    uint public nextPendingApprovalId = 0;
    mapping (uint => PendingApproval) public pendingApprovals; // just use an array? TODO

    // @Override
    function autoSubmitProof(address user, address tokenAddrToReceiveVerifierNotice, uint claimId) public {
        PendingApproval memory pa;
        pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = user;
        uint groupId = _getGroupId(tokenAddrToReceiveVerifierNotice);
        pa.approverGroupId = groupId;
        pa.pendingApprovalId = nextPendingApprovalId;
        pa.isIndividualApprover = false;

        string memory message = string(abi.encodePacked(getMessageText(), Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name(),
            ". Once a member of the group approves, these messages get marked as read for all others."));

        address[] memory members = Fin4Groups(Fin4GroupsAddress).getGroupMembers(groupId);

        pa.groupMemberAddresses = new address[](members.length);
        pa.messageIds = new uint[](members.length);
        for (uint i = 0; i < members.length; i ++) {
            pa.groupMemberAddresses[i] = members[i];
            pa.messageIds[i] = Fin4Messaging(Fin4MessagingAddress)
                .addPendingApprovalMessage(user, name, members[i], message, "", pa.pendingApprovalId);
        }

        pendingApprovals[nextPendingApprovalId] = pa;
        nextPendingApprovalId ++;

        _sendPendingNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId);
    }

    function getMessageText() public pure returns(string memory) {
        return "You are a member of a user group that was appointed for approving this claim on the token ";
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:Group ID:see table in groups overview";
    }

    mapping (address => uint) public tokenToParameter;

    function setParameters(address token, uint groupId) public {
      require(Fin4Groups(Fin4GroupsAddress).groupExists(groupId), "Group ID does not exist");
      tokenToParameter[token] = groupId;
    }

    function _getGroupId(address token) public view returns(uint) {
        return tokenToParameter[token];
    }

    // copied method signature from SpecificAddress, then nothing has to be changed in Messages.jsx

    function receiveApprovalFromSpecificAddress(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        require(Fin4Groups(Fin4GroupsAddress).isMember(pa.approverGroupId, msg.sender), "You are not a member of the appointed approver group");
        markMessagesAsRead(pendingApprovalId);

        _sendApprovalNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, "");
    }

    function receiveRejectionFromSpecificAddress(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        require(Fin4Groups(Fin4GroupsAddress).isMember(pa.approverGroupId, msg.sender), "You are not a member of the appointed approver group");
        markMessagesAsRead(pendingApprovalId);

        string memory message = string(abi.encodePacked(
            "A member of the appointed approver group has rejected your approval request for ",
            Fin4TokenBase(pa.tokenAddrToReceiveVerifierNotice).name()));
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), pa.requester, message);
        _sendRejectionNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, "");
    }

    function markMessagesAsRead(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        for (uint i = 0; i < pa.messageIds.length; i ++) {
            Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(pa.groupMemberAddresses[i], pa.messageIds[i]);
        }
    }
}
