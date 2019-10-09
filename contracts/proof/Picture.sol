pragma solidity ^0.5.0;

import "contracts/proof/SpecificAddress.sol";

contract Picture is SpecificAddress {

  constructor(address Fin4MainAddress)
    SpecificAddress(Fin4MainAddress)
    public {}

  // @Override
  function setNameAndDescription() public returns(bool) {
    name = "Picture";
    description = "The claimer has to supply a picture, based on which the approver will decide to approve.";
  }

  function submitProof_Picture(address tokenAdrToReceiveProof, uint claimId, address approver, string memory IPFShash) public returns(bool) {
    // TODO minimize duplicate code by reusing super method
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
      msg.sender, approver, message, address(this), IPFShash, pa.pendingApprovalId);
    pendingApprovals[approver].push(pa);
    return true;
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    // TODO include the quantity into the message
    return "Please check this picture proof and approve the correct amount of this token: ";
  }

  function getAttachment(uint pendingApprovalId) public view returns(string memory) {
    return pendingApprovals[msg.sender][pendingApprovalId].attachment;
  }

}
