pragma solidity ^0.5.0;

import "contracts/verifiers/interactive/SpecificAddress.sol";

contract TokenCreator is SpecificAddress {

   constructor() public  {}

  // @Override
  function init() public {
    name = "TokenCreator";
    description = "The token creator has to approve.";
  }

  function submitProof_TokenCreator(address tokenAddrToReceiveVerifierNotice, uint claimId) public {
    submitProof_SpecificAddress(tokenAddrToReceiveVerifierNotice, claimId, getCreatorOfToken(tokenAddrToReceiveVerifierNotice));
  }

  // @Override
  function getMessageText() public pure returns(string memory) {
    return "You as the token creator were requested to approve the verifier type TokenCreator on the token ";
  }

}
