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
    string memory IPFShash) public {

    // to user-chosen approver
    PendingApproval memory pa;
    pa.tokenAdrToReceiveProof = tokenAdrToReceiveProof;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;
    pa.attachment = IPFShash;
    pa.pendingApprovalId = pendingApprovals[approver].length;

    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAdrToReceiveProof).name()));
    pa.messageId = Fin4Messages(_Fin4MessagesAddr()).addPendingApprovalMessage(
      msg.sender, name, approver, message, IPFShash, pa.pendingApprovalId);

    // to token-creator
    address tokenCreator = getCreatorOfToken(tokenAdrToReceiveProof);

    PendingApproval memory paTC;
    paTC.tokenAdrToReceiveProof = tokenAdrToReceiveProof;
    paTC.claimIdOnTokenToReceiveProof = claimId;
    paTC.requester = msg.sender;
    paTC.approver = tokenCreator;
    paTC.attachment = IPFShash;
    paTC.pendingApprovalId = pendingApprovals[tokenCreator].length;

    string memory messageTC = string(abi.encodePacked(getMessageTextForTokenCreator(),
      Fin4TokenBase(tokenAdrToReceiveProof).name()));
    paTC.messageId = Fin4Messages(_Fin4MessagesAddr()).addPendingApprovalMessage(
      msg.sender, name, tokenCreator, messageTC, IPFShash, paTC.pendingApprovalId);

    // connect the two PendingApprovals
    pa.isApproved = false;
    paTC.isApproved = false;
    pa.linkedWith = tokenCreator;
    pa.linkedWithPendingApprovalId = paTC.pendingApprovalId;
    paTC.linkedWith = approver;
    paTC.linkedWithPendingApprovalId = pa.pendingApprovalId;

    pendingApprovals[approver].push(pa);
    pendingApprovals[tokenCreator].push(paTC);
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    return "Please check this picture proof and approve the correct amount of this token: ";
  }

  function getMessageTextForTokenCreator() public pure returns(string memory) {
    return "As token creator, please check this picture proof and approve the correct amount of this token: ";
  }

  function getAttachment(uint pendingApprovalId) public view returns(string memory) {
    return pendingApprovals[msg.sender][pendingApprovalId].attachment;
  }

  // @Override
  function receiveApprovalFromSpecificAddress(uint pendingApprovalId) public returns(bool) {
    PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
    require(pa.approver == msg.sender, "This address is not registered as approver for any pending approval");
    Fin4Messages(_Fin4MessagesAddr()).markMessageAsActedUpon(msg.sender, pa.messageId);

    pa.isApproved = true;
    address otherApprover = pa.linkedWith;
    uint otherApproversPendingApprovalId = pa.linkedWithPendingApprovalId;

    if (pendingApprovals[otherApprover][otherApproversPendingApprovalId].isApproved) {
        _sendApproval(address(this), pa.tokenAdrToReceiveProof, pa.claimIdOnTokenToReceiveProof);
        return true;
    }

    return false;
  }

}
