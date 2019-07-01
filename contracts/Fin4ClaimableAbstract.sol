pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Fin4ClaimableAbstract { // abstract class

  uint nextClaimId = 0;

	struct Claim {
    uint claimId;
    address claimer;
    bool isApproved;
    uint quantity;
    uint date;
    string comment;
    mapping(address => bool) proof_statuses;
  }

	mapping (uint => Claim) public claims;

	function submit(uint quantity, uint date, string memory comment) public returns (uint) {
    Claim storage claim = claims[nextClaimId];
    claim.claimer = msg.sender;
    claim.quantity = quantity;
    claim.date = date;
    claim.comment = comment;
    address[] memory requiredProofs = getRequiredProofTypes();
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
    pingbackClaimSubmissionToMain();
    return nextClaimId - 1;
  }

  function getName() public view returns(string memory);

  function getSymbol() public view returns(string memory);

  function pingbackClaimSubmissionToMain() public returns(bool);

  function getRequiredProofTypes() public view returns(address[] memory);

  function getClaim(uint claimId) public view returns(string memory, string memory, address, bool, uint, uint, string memory, address[] memory, bool[] memory) {
    // require(claims[claimId].claimer == msg.sender, "This claim was not submitted by the sender");

    Claim storage claim = claims[claimId];
    // this assumes these are still the same as when the claim was submitted, should we support an evolving set of proof types though? TODO
    address[] memory requiredProofTypes = getRequiredProofTypes();
    bool[] memory proofTypeStatuses = new bool[](requiredProofTypes.length);
    for (uint i = 0; i < requiredProofTypes.length; i ++) {
      proofTypeStatuses[i] = claim.proof_statuses[requiredProofTypes[i]];
    }

    return (getName(), getSymbol(), claim.claimer, claim.isApproved, claim.quantity, claim.date, claim.comment, requiredProofTypes, proofTypeStatuses);
  }

  function getClaimInfo(uint claimId) public view returns(address, bool, uint, uint, string memory) {
    return (claims[claimId].claimer, claims[claimId].isApproved, claims[claimId].quantity, claims[claimId].date, claims[claimId].comment);
  }

  function getMyClaimIds() public view returns(address, string memory, string memory, uint[] memory) {
    uint count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          count ++;
      }
    }
    uint[] memory ids = new uint[](count);
    count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          ids[count] = i;
          count ++;
      }
    }
    return (address(this), getName(), getSymbol(), ids);
  }

}
