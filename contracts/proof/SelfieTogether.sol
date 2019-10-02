pragma solidity ^0.5.0;

import "contracts/proof/SpecificAddress.sol";

contract SelfieTogether is SpecificAddress {

  constructor(address Fin4MainAddress)
    SpecificAddress(Fin4MainAddress)
    public {}

  // @Override
  function setNameAndDescription() public returns(bool) {
    name = "SelfieTogether";
    description = "The claimer supplies a picture, based on which a self-chosen approver and the token creator decide to approve.";
  }

  function submitProof_SelfieTogether(address tokenAdrToReceiveProof, uint claimId, address approver,
    string memory IPFShash) public returns(bool) {

    // to user-chosen approver
    PendingApproval storage pa = pendingApprovals[approver];
    pa.tokenAdrToReceiveProof = tokenAdrToReceiveProof;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;
    pa.attachment = IPFShash;
    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAdrToReceiveProof).name()));
    pa.messageId = Fin4Messages(_Fin4MessagesAddr()).addMessage(uint(messageType), msg.sender, approver, message, address(this), IPFShash);

    // to token-creator
    address tokenCreator = getCreatorOfToken(tokenAdrToReceiveProof);

    PendingApproval storage paTC = pendingApprovals[tokenCreator];
    paTC.tokenAdrToReceiveProof = tokenAdrToReceiveProof;
    paTC.claimIdOnTokenToReceiveProof = claimId;
    paTC.requester = msg.sender;
    paTC.approver = tokenCreator;
    paTC.attachment = IPFShash;
    string memory messageTC = string(abi.encodePacked(getMessageTextForTokenCreator(),
      Fin4TokenBase(tokenAdrToReceiveProof).name()));
    paTC.messageId = Fin4Messages(_Fin4MessagesAddr()).addMessage(uint(messageType),
      msg.sender, tokenCreator, messageTC, address(this), IPFShash);

    // connect the two PendingApprovals
    pa.isApproved = false;
    paTC.isApproved = false;
    pa.linkedWith = tokenCreator;
    paTC.linkedWith = approver;
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    return "Please check this picture proof and approve the correct amount of this token: ";
  }

  function getMessageTextForTokenCreator() public pure returns(string memory) {
    return "As token creator, please check this picture proof and approve the correct amount of this token: ";
  }

  function getAttachment() public view returns(string memory) {
    return pendingApprovals[msg.sender].attachment;
  }

  // @Override
  function receiveApprovalFromSpecificAddress() public returns(bool) {
    require(pendingApprovals[msg.sender].approver == msg.sender, "This address is not registered as approver for any pending approval");
    Fin4Messages(_Fin4MessagesAddr()).markMessageAsActedUpon(msg.sender, pendingApprovals[msg.sender].messageId);

    pendingApprovals[msg.sender].isApproved = true;
    address otherApprover = pendingApprovals[msg.sender].linkedWith;

    if (pendingApprovals[otherApprover].isApproved) {
        _sendApproval(address(this), pendingApprovals[msg.sender].tokenAdrToReceiveProof, pendingApprovals[msg.sender].claimIdOnTokenToReceiveProof);
        return true;
    }

    return false;
  }

}
