pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import 'contracts/Fin4Token.sol';

contract Fin4Claim {

  address[] public requiredProofs;
  uint nextClaimId = 0;

	struct Claim {
    uint claimId;
    address claimer;
    bool isApproved;
    string action;
    uint quantity;
    uint date;
    string comment;
    mapping(address => bool) proof_statuses;
  }

	mapping (uint => Claim) public claims;

	function submit(string memory action, uint quantity, uint date, string memory comment) public returns (uint) {
    // TODO: proofs input

    Claim storage claim = claims[nextClaimId];
    claim.claimer = msg.sender;
    claim.action = action;
    claim.quantity = quantity;
    claim.date = date;
    claim.comment = comment;
    for (uint i = 0; i < requiredProofs.length; i ++) {
      claim.proof_statuses[requiredProofs[i]] = false;
    }
    claim.isApproved = false;
    nextClaimId ++;
    return nextClaimId - 1;
  }

  function getStatuses() public view returns(string[] memory, uint[] memory, bool[] memory) {
    uint count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          count ++;
      }
    }
    string[] memory header = new string[](2);
    header[0] = "ID";
    header[1] = "state";
    uint[] memory ids = new uint[](count);
    bool[] memory states = new bool[](count);
    count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          ids[count] = i;
          states[count] = claims[i].isApproved;
          count ++;
      }
    }
    return (header, ids, states);
  }

}
