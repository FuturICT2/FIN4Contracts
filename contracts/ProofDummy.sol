pragma solidity ^0.5.0;

import "contracts/KISSConversationToken.sol";

contract ProofDummy {

  // as proof of concept we are accepting it right away and tell the token contract about it
  function submitProof(address SCtoReceiveProof, uint claimId) public returns(bool) {
    KISSConversationToken(SCtoReceiveProof).receiveApprovedProof(msg.sender, claimId);
    //wip: without having to import KISSConversationToken:
    //SCToReceiveProof.call(bytes4(sha3("receiveApprovedProof(address)")), msg.sender); // via https://ethereum.stackexchange.com/a/27706
    return true;
  }

}
