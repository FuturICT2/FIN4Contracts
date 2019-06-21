pragma solidity ^0.5.0;

import 'contracts/Fin4Token.sol';

contract Fin4Claim {

  address[] public requiredProofs;
  uint nextClaimId = 0;

	struct Claim {
    uint claimId;
    address claimer;
    bool isApproved;
    mapping(address => bool) proof_statuses;
  }

	mapping (uint => Claim) public claims;

	function submit(string memory action, uint quantity, uint date, string memory comment) public returns (uint) {
    // TODO: proofs input

    Claim storage claim = claims[nextClaimId];
    claim.claimer = msg.sender;
    for (uint i = 0; i < requiredProofs.length; i ++) {
      claim.proof_statuses[requiredProofs[i]] = false;
    }
    claim.isApproved = false;
    nextClaimId ++;
    return nextClaimId - 1;
  }

}
