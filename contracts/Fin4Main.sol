pragma solidity ^0.5.0;

import 'contracts/Fin4Token.sol';

contract Fin4Main {

  address[] public children;
  address[] public requiredProofs;
  uint nextClaimId = 0;

	struct Claim {
    uint claimId;
    address claimer;
    bool isApproved;
    mapping(address => bool) proof_statuses;
  }

	mapping (uint => Claim) public claims;

	function createNewToken(string memory name, string memory symbol, uint8 decimals) public returns(address) {
    Fin4Token newToken = new Fin4Token(name, symbol, decimals);
    children.push(address(newToken));
    return address(newToken);
  }

	function submitClaim(string memory action, uint quantity, uint date, string memory comment) public returns (uint) {
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

  function getStatusesOfMyClaims() public view returns(uint[] memory, bool[] memory) {
    uint count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          count ++;
      }
    }
    uint[] memory claimIdArr = new uint[](count);
    bool[] memory isApprovedArr = new bool[](count);
    count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          claimIdArr[count] = i;
          isApprovedArr[count] = claims[i].isApproved;
          count ++;
      }
    }
    return (claimIdArr, isApprovedArr);
  }

  function getChildren() public view returns(address[] memory) {
    return children;
  }

}
