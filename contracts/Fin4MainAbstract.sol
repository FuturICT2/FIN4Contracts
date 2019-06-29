pragma solidity ^0.5.0;

contract Fin4MainAbstract {

  function proofTypeIsRegistered(address proofTypeToCheck) public view returns(bool);

  function claimSubmissionPingback(address claimer) public returns(bool);

}
