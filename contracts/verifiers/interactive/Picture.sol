pragma solidity ^0.5.0;

import "contracts/verifiers/interactive/SpecificAddress.sol";

contract Picture is SpecificAddress {

  constructor(address Fin4MessagingAddress)
    SpecificAddress(Fin4MessagingAddress)
    public {}

  // @Override
  function init() public {
    name = "Picture";
    description = "The claimer has to supply a picture, based on which the approver will decide to approve.";
  }

  function submitEvidence_Picture(address tokenAddrToReceiveVerifierDecision, uint claimId, address approver, string memory IPFShash) public {
    // TODO minimize duplicate code by reusing super method
    PendingApproval memory pa;
    pa.tokenAddrToReceiveVerifierDecision = tokenAddrToReceiveVerifierDecision;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;
    pa.attachment = IPFShash;
    pa.pendingApprovalId = pendingApprovals[approver].length;
    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAddrToReceiveVerifierDecision).name()));
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
