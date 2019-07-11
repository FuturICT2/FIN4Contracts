pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4TokenBase.sol";

contract SpecificAddress is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      setNameAndDescription();
      messageType = MessageType.APPROVAL;
    }

  function setNameAndDescription() public returns(bool) {
    name = "SpecificAddress";
    description = "The claimer specifies an address, which has to approve.";
  }

  struct PendingApproval {
    address tokenAdrToReceiveProof;
    uint claimIdOnTokenToReceiveProof;
    address requester;
    address approver;
    string attachment;
  }

  // this assumes only one pending approval per address, TODO value must be an array
  mapping (address => PendingApproval) public pendingApprovals;

  function submitProof(address tokenAdrToReceiveProof, uint claimId, address approver) public returns(bool) {
    PendingApproval storage pa = pendingApprovals[approver];
    pa.tokenAdrToReceiveProof = tokenAdrToReceiveProof;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;
    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAdrToReceiveProof).name()));
    Fin4Messages(_Fin4MessagesAddr()).addMessage(uint(messageType), msg.sender, approver, message, address(this));
    return true;
  }

  // @Override
  function getSubmitProofMethodArgsCount() public view returns(uint) {
    return 3;
  }

  // @Override
  function getParameterForActionTypeCreatorToSetEncoded() public view returns(string memory) {
    return "";
  }

  function getMessageText() public pure returns(string memory) {
    return "You were requested to approve the proof type SpecificAddress on the action type ";
  }

  function receiveApprovalFromSpecificAddress() public returns(bool) {
    require(pendingApprovals[msg.sender].approver == msg.sender, "This address is not registered as approver for any pending approval");
    _sendApproval(pendingApprovals[msg.sender].tokenAdrToReceiveProof, pendingApprovals[msg.sender].claimIdOnTokenToReceiveProof);
    return true;
  }

}
