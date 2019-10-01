pragma solidity ^0.5.0;

contract Fin4MainStub {

  function proofTypeIsRegistered(address proofTypeToCheck) public view returns(bool);

  function getFin4MessagesAddress() public view returns(address);

  function claimApprovedPingback(address tokenAddress, address claimer, uint claimId) public;

  function proofApprovalPingback(address tokenAdrToReceiveProof, address proofTypeAddress, uint claimId, address claimer) public;

}
