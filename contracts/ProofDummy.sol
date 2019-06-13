pragma solidity ^0.5.0;

import "contracts/Fin4BaseToken.sol";

contract ProofDummy {

  // as proof of concept we are accepting it right away and tell the token contract about it
  function submitProof(address SCtoReceiveProof, uint claimId) public returns(bool) {
    Fin4BaseToken(SCtoReceiveProof).receiveApprovedProof(msg.sender, claimId);
    //wip: without having to import Fin4BaseToken:
    //SCToReceiveProof.call(bytes4(sha3("receiveApprovedProof(address)")), msg.sender); // via https://ethereum.stackexchange.com/a/27706
    return true;
  }

}
