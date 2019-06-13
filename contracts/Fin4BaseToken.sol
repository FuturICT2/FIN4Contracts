pragma solidity ^0.5.0;

contract Fin4BaseToken {

  address[] public requiredProofs;
  uint nextClaimId = 0;

  constructor() public {
      //requiredProofs.push(0x8Ec64a3a7f6021b5f66edb9D6f11AE1862280aaf);
  }

  struct Claim {
    uint claimId;
    address claimer;
    mapping(address => bool) proof_statuses;
  }

  mapping (uint => Claim) public claims;

  function getRequiredProofsCount() public view returns(uint) {
    return requiredProofs.length;
  }

  function getRequiredProofAddress(uint index) public view returns(address) {
    return requiredProofs[index];
  }

  function getClaimStatus(uint claimId) public view returns(address, bool) {
    require(msg.sender == claims[claimId].claimer);
    // TODO loop over all, not just return the status of the first one
    return (requiredProofs[0], claims[claimId].proof_statuses[requiredProofs[0]]);
  }

  function submitClaim() public returns (uint) {
    Claim storage claim = claims[nextClaimId];
    claim.claimer = msg.sender;
    for (uint i = 0; i < requiredProofs.length; i ++) {
      claim.proof_statuses[requiredProofs[i]] = false;
    }
    nextClaimId ++;
    return nextClaimId - 1;
  }

  // called from ProofDummy, therefore msg.sender is its address
  function receiveApprovedProof(address claimer, uint claimId) public returns(bool) {
    require(claimer == claims[claimId].claimer);
    claims[claimId].proof_statuses[msg.sender] = true;
    return true;
  }

  function addRequiredProof(address proofSCaddress) public returns(bool) {
    requiredProofs.push(proofSCaddress);
    return true;
  }

  // TODO slice it out of the array - and probably from all pending claims that have it in their proof_statuses?
  //function removeRequiredProof(address proofSCaddress) public returns(bool) {
  //  return true;
  //}
}
