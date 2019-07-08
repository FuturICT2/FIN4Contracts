pragma solidity ^0.5.0;

import "contracts/proof/SpecificAddress.sol";

contract Picture is SpecificAddress {

  constructor(address Fin4MainAddress)
    SpecificAddress(Fin4MainAddress)
    public {}

  // @Override
  function setNameAndDescription() public returns(bool) {
    name = "Picture";
    description = "The claimer has to supply a picture, based on which the approver will decide to approve";
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
