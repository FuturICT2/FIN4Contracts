pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import 'contracts/Fin4Token.sol';

contract Fin4Claim {

  uint nextClaimId = 0;

	struct Claim {
    uint claimId;
    address claimer;
    bool isApproved;
    address actionAdr;
    uint quantity;
    uint date;
    string comment;
    mapping(address => bool) proof_statuses;
  }

	mapping (uint => Claim) public claims;

	function submit(address action, uint quantity, uint date, string memory comment) public returns (uint) {
    Claim storage claim = claims[nextClaimId];
    claim.claimer = msg.sender;
    claim.actionAdr = action;
    claim.quantity = quantity;
    claim.date = date;
    claim.comment = comment;
    address[] memory requiredProofs = Fin4Token(action).getRequiredProofTypes();
    for (uint i = 0; i < requiredProofs.length; i ++) {
      claim.proof_statuses[requiredProofs[i]] = false;
    }
    // TODO: Need to be always set to false
    // We set it to true just for the Demo to show the transfer to token to the user
    if (nextClaimId % 2 == 0) {
        claim.isApproved = false;
    } else {
      claim.isApproved = true;
      // TODO mintToken(action, quantity);
    }
    nextClaimId ++;
    return nextClaimId - 1;
  }

  function getStatuses() public view returns(uint[] memory, bool[] memory, uint[] memory) {
    uint count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          count ++;
      }
    }
    uint[] memory ids = new uint[](count);
    uint[] memory quantity = new uint[](count);
    bool[] memory states = new bool[](count);
    count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          ids[count] = i;
          states[count] = claims[i].isApproved;
          quantity[count] = claims[i].quantity;
          count ++;
      }
    }
    return (ids, states, quantity);
  }

  // for dev purposes only, this is NOT the normal flow
  function approveClaim(uint claimId) public returns(bool) {
    claims[claimId].isApproved = true;
    return true;
  }

  address[] public proofTypes;

  function addProofType(address proofType) public returns(bool) {
    proofTypes.push(proofType);
    return true;
  }

  function getProofTypes() public view returns(address[] memory) {
    return proofTypes;
  }

  // called from Fin4Token instances to ensure the required proof types there are a subset of the proofTypes here
  function proofTypeIsRegistered(address proofTypeToCheck) public view returns(bool) {
    for (uint i = 0; i < proofTypes.length; i++) {
      if (proofTypes[i] == proofTypeToCheck) {
        return true;
      }
    }
    return false;
  }

}
