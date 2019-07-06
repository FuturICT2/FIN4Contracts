pragma solidity ^0.5.0;

import "contracts/proof/ApprovalBySpecificAddress.sol";

contract PictureApprovalBySpecificAddress is ApprovalBySpecificAddress {

  constructor(address Fin4MainAddress)
    ApprovalBySpecificAddress(Fin4MainAddress)
    public {}

  // @Override
  function setNameAndDescription() public returns(bool) {
    name = "PictureApprovalBySpecificAddress";
    description = "The claimer has to supply a picture proofing the action done. Based on that the approver will decide on the claim";
  }

  function submitProof(address tokenAdrToReceiveProof, uint claimId, address approver, string memory imageURL) public returns(bool) {
    pendingApprovals[approver].attachment = imageURL;
    submitProof(tokenAdrToReceiveProof, claimId, approver);
  }

  // @Override
  function getSubmitProofMethodArgsCount() public view returns(uint) {
    return 4;
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    return "You were requested to approve the proof type PictureApprovalBySpecificAddress on the action type  ";
  }

  function getAttachment() public view returns(string memory) {
    // TODO verification
    return pendingApprovals[msg.sender].attachment;
  }

}
