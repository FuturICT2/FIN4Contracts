pragma solidity ^0.5.0;

contract Fin4TokenStrut {

  function receiveProofApproval(address claimer, uint claimId) public returns(bool);

  function getTimeBetweenThisClaimAndThatClaimersPreviousOne(address claimer, uint claimId) public view returns(uint);

}
