pragma solidity ^0.5.0;

import "contracts/proof/SpecificAddress.sol";

contract ActionTypeCreator is SpecificAddress {

  constructor(address Fin4MainAddress)
    SpecificAddress(Fin4MainAddress)
    public {}

  // @Override
  function setNameAndDescription() public returns(bool) {
    name = "ActionTypeCreator";
    description = "The action type creator (you) has to approve";
  }

  function submitProof(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
    submitProof(tokenAdrToReceiveProof, claimId, getCreatorOfToken(tokenAdrToReceiveProof));
  }

  // @Override
  function getSubmitProofMethodArgsCount() public view returns(uint) {
    return 2;
  }

  // @Override
  function getParameterForActionTypeCreatorToSetEncoded() public view returns(string memory) {
    return "";
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    return "You as action type creator were requested to approve the proof type ActionTypeCreator on the action type ";
  }

}
