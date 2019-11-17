pragma solidity ^0.5.0;

import "contracts/proof/SpecificAddress.sol";

contract TokenCreator is SpecificAddress {

  constructor(address Fin4MessagingAddress)
    SpecificAddress(Fin4MessagingAddress)
    public {}

  // @Override
  function setNameAndDescription() public {
    name = "TokenCreator";
    description = "The token creator has to approve.";
  }

  function submitProof_TokenCreator(address tokenAddrToReceiveProof, uint claimId) public {
    submitProof_SpecificAddress(tokenAddrToReceiveProof, claimId, getCreatorOfToken(tokenAddrToReceiveProof));
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    return "You as the token creator were requested to approve the proof type TokenCreator on the token ";
  }

}
