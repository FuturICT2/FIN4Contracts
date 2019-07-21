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
    PendingApproval storage pa = pendingApprovals[approver];
    pa.tokenAdrToReceiveProof = tokenAdrToReceiveProof;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;
    pa.attachment = IPFShash;
    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAdrToReceiveProof).name()));
    pa.messageId = Fin4Messages(_Fin4MessagesAddr()).addMessage(uint(messageType), msg.sender, approver, message, address(this), IPFShash);
  }

  // @Override
  function getParameterForActionTypeCreatorToSetEncoded() public view returns(string memory) {
    return "";
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    return "You were requested to approve the proof type Picture on the action type ";
  }

  function getAttachment() public view returns(string memory) {
    // TODO verification
    return pendingApprovals[msg.sender].attachment;
  }

}
