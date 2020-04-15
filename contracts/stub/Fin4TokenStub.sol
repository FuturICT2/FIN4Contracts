pragma solidity ^0.5.0;

contract Fin4TokenStub {

  function name() public view returns(string memory);

  function receiveProofApproval(address verifierTypeAddress, uint claimId) public;

  function receiveProofRejection(address verifierTypeAddress, uint claimId) public;

  function countApprovedClaimsOfThisUser(address user) public returns(uint);
}
