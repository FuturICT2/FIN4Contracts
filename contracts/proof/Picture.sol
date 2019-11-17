pragma solidity ^0.5.0;

import "contracts/proof/SpecificAddress.sol";

contract Picture is SpecificAddress {

  constructor(address Fin4MessagingAddress)
    SpecificAddress(Fin4MessagingAddress)
    public {}

  // @Override
  function setNameAndDescription() public returns(bool) {
    name = "Picture";
    description = "The claimer has to supply a picture, based on which the approver will decide to approve.";
  }

  function submitProof_Picture(address tokenAddrToReceiveProof, uint claimId, address approver, string memory IPFShash) public {
    // TODO minimize duplicate code by reusing super method
    PendingApproval memory pa;
    pa.tokenAddrToReceiveProof = tokenAddrToReceiveProof;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;
    pa.attachment = IPFShash;
    pa.pendingApprovalId = pendingApprovals[approver].length;
    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAddrToReceiveProof).name()));
    pa.messageId = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(
      msg.sender, name, approver, message, IPFShash, pa.pendingApprovalId);
    pendingApprovals[approver].push(pa);
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    // TODO include the quantity into the message
    return "Please check this picture proof and approve the correct amount of this token: ";
  }

}
