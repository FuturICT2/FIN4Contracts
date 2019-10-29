pragma solidity ^0.5.0;

import "contracts/proof/ApprovalByGroupMember.sol";

contract SelfieTogether is ApprovalByGroupMember {

  constructor(address Fin4MessagingAddress)
    ApprovalByGroupMember(Fin4MessagingAddress)
    public {}

  // @Override
  function setNameAndDescription() public returns(bool) {
    name = "SelfieTogether";
    description = "The claimer supplies a picture, based on which a self-chosen approver and a member of a predefined group of users decide to approve.";
  }

  function submitProof_SelfieTogether(address tokenAddrToReceiveProof, uint claimId, address approver,
    string memory IPFShash) public {

    // to user-chosen approver
    PendingApproval memory pa;
    pa.tokenAddrToReceiveProof = tokenAddrToReceiveProof;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.groupMemberAddresses[0] = approver;
    pa.attachment = IPFShash;
    pa.pendingApprovalId = nextPendingApprovalId;
    pa.isIndividualApprover = true;

    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAddrToReceiveProof).name()));
    pa.messageIds[0] = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(
      msg.sender, name, approver, message, IPFShash, pa.pendingApprovalId);

    pendingApprovals[nextPendingApprovalId] = pa;
    nextPendingApprovalId ++;

    // to approver-group set by token-creator

    PendingApproval memory paG;
    paG.tokenAddrToReceiveProof = tokenAddrToReceiveProof;
    paG.claimIdOnTokenToReceiveProof = claimId;
    paG.requester = msg.sender;
    uint groupId = _getGroupId(tokenAddrToReceiveProof);
    paG.approverGroupId = groupId;
    paG.attachment = IPFShash;
    paG.pendingApprovalId = nextPendingApprovalId;
    paG.isIndividualApprover = false;

    string memory messageG = string(abi.encodePacked(getMessageText(), Fin4TokenBase(tokenAddrToReceiveProof).name(),
            ". Once a member of the group approves, these messages get marked as read for all others."));

    address[] memory members = Fin4Groups(Fin4GroupsAddress).getGroupMembers(groupId);

    paG.groupMemberAddresses = new address[](members.length);
    paG.messageIds = new uint[](members.length);
    for (uint i = 0; i < members.length; i ++) {
      paG.groupMemberAddresses[i] = members[i];
      paG.messageIds[i] = Fin4Messaging(Fin4MessagingAddress)
        .addPendingApprovalMessage(msg.sender, name, members[i], messageG, "", paG.pendingApprovalId);
    }

    pendingApprovals[nextPendingApprovalId] = paG;
    nextPendingApprovalId ++;

    // connect the two PendingApprovals
    pa.isApproved = false;
    paG.isApproved = false;
    pa.linkedWithPendingApprovalId = paG.pendingApprovalId;
    paG.linkedWithPendingApprovalId = pa.pendingApprovalId;
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    return "Please check this selfie and approve it if you are in it: ";
  }

  function getMessageTextForGroupMember() public pure returns(string memory) {
    return "As a member of the appointed approval group, please check this selfie and approve it: ";
  }

  function getAttachment(uint pendingApprovalId) public view returns(string memory) {
    return pendingApprovals[pendingApprovalId].attachment;
  }

  // @Override
  function receiveApprovalFromSpecificAddress(uint pendingApprovalId) public {
    PendingApproval storage pa = pendingApprovals[pendingApprovalId];

    if (pa.isIndividualApprover) {
      require(pa.groupMemberAddresses[0] == msg.sender, "You are not an approver on this instance");
    } else {
      require(Fin4Groups(Fin4GroupsAddress).isMember(pa.approverGroupId, msg.sender), "You are not a member of the appointed approver group");
      markMessagesAsRead(pendingApprovalId);
    }

    pa.isApproved = true;

    if (pendingApprovals[pa.linkedWithPendingApprovalId].isApproved) {
      _sendApproval(address(this), pa.tokenAddrToReceiveProof, pa.claimIdOnTokenToReceiveProof);
    }
  }

}
