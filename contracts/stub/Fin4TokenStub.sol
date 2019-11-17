pragma solidity ^0.5.0;

contract Fin4TokenStub {

  function name() public view returns(string memory);

  function receiveProofApproval(address proofTypeAddress, uint claimId) public;

  function receiveProofRejection(address proofTypeAddress, uint claimId) public;

  function getTimeBetweenThisClaimAndThatClaimersPreviousOne(address claimer, uint claimId) public view returns(uint);

  function sumUpQuantitiesWithinIntervalBeforeThisClaim(address claimer, uint claimId, uint interval) public view returns(uint, uint);

}
