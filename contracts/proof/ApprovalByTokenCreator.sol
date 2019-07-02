pragma solidity ^0.5.0;

import "contracts/proof/ApprovalBySpecificAddress.sol";

contract ApprovalByTokenCreator is ApprovalBySpecificAddress {

  constructor(address Fin4MainAddress)
    ApprovalBySpecificAddress(Fin4MainAddress)
    public {}

  // @Override
  function setNameAndDescription() public returns(bool) {
    name = "ApprovalByTokenCreator";
    description = "The token creator has to approve";
  }

  function submitProof(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
    submitProof(tokenAdrToReceiveProof, claimId, getCreatorOfToken(tokenAdrToReceiveProof));
  }

  // @Override
  function getSubmitProofMethodArgsCount() public view returns(uint) {
    return 2;
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    return "You as action type creator were requested to approve the proof type ApprovalByTokenCreator on the action type ";
  }

}
