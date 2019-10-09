pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4TokenBase.sol";

contract SpecificAddress is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      setNameAndDescription();
    }

  function setNameAndDescription() public returns(bool) {
    name = "SpecificAddress";
    description = "The claimer specifies an address, which has to approve.";
  }

  // Holds the info of a pending approval: who should approve what on which token
  // Get's displayed on the frontend as message
  struct PendingApproval {
    address tokenAdrToReceiveProof;
    uint claimIdOnTokenToReceiveProof;
    address requester;
    address approver;
    string attachment;
    uint messageId;
    bool isApproved;
    address linkedWith; // key in pendingApprovals that is linked with this one. only if both are approved, send the overall approval
    uint pendingApprovalId;
    uint linkedWithPendingApprovalId;
  }

  mapping (address => PendingApproval[]) public pendingApprovals;

  function submitProof_SpecificAddress(address tokenAdrToReceiveProof, uint claimId, address approver) public returns(bool) {
    PendingApproval memory pa;
    pa.tokenAdrToReceiveProof = tokenAdrToReceiveProof;
    pa.claimIdOnTokenToReceiveProof = claimId;
    pa.requester = msg.sender;
    pa.approver = approver;

    pa.pendingApprovalId = pendingApprovals[approver].length;

    string memory message = string(abi.encodePacked(getMessageText(),
      Fin4TokenBase(tokenAdrToReceiveProof).name()));
    pa.messageId = Fin4Messages(_Fin4MessagesAddr()).addPendingApprovalMessage(
        msg.sender, approver, message, address(this), "", pa.pendingApprovalId);

    pendingApprovals[approver].push(pa);
    return true;
  }

  function getMessageText() public pure returns(string memory) {
    return "You were requested to approve the proof type SpecificAddress on the action type ";
  }

  function receiveApprovalFromSpecificAddress(uint pendingApprovalId) public returns(bool) {
    PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
    require(pa.approver == msg.sender, "This address is not registered as approver for any pending approval");
    Fin4Messages(_Fin4MessagesAddr()).markMessageAsActedUpon(msg.sender, pa.messageId);
    _sendApproval(address(this), pa.tokenAdrToReceiveProof, pa.claimIdOnTokenToReceiveProof);
    return true;
  }

}
