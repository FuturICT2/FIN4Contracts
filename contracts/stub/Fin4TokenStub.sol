pragma solidity ^0.5.0;

contract Fin4TokenStub {

  function name() public view returns(string memory);

  function receiveVerifierApproval(address verifierTypeAddress, uint claimId) public;

  function receiveVerifierRejection(address verifierTypeAddress, uint claimId) public;

  function receiveVerifierPendingNotice(address verifierTypeAddress, uint claimId) public;

  function countApprovedClaimsOfThisUser(address user) public returns(uint);
}
