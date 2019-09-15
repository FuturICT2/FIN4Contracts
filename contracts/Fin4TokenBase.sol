pragma solidity ^0.5.0;

import 'contracts/stub/Fin4MainStub.sol';
import "contracts/proof/Fin4BaseProofType.sol";

contract Fin4TokenBase { // abstract class

  address public Fin4Main;
  address public actionTypeCreator;
  string public description;

  constructor(address Fin4MainAddress, address actionTypeCreatorAddress, string memory _description) public {
    Fin4Main = Fin4MainAddress;
    actionTypeCreator = actionTypeCreatorAddress;
    description = _description;
  }

  function name() public view returns(string memory);
  function symbol() public view returns(string memory);

  function getInfo() public view returns(string memory, string memory, string memory) {
    return (name(), symbol(), description);
  }

  // ------------------------- CLAIM -------------------------

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

  // Called by submitClaim in Fin4Main
  // intentional forwarding like this so that the front end doesn't need to know which token to submit a claim to at the moment of submitting it
	function submit(address claimer, uint quantity, uint date, string memory comment) public returns (uint) {
    Claim storage claim = claims[nextClaimId];
    claim.claimId = nextClaimId;
    claim.claimer = claimer;
    claim.quantity = quantity;
    claim.date = date;
    claim.comment = comment;
    address[] memory requiredProofs = getRequiredProofTypes();
    // initialize all the proofs required by the action type creator with false
    for (uint i = 0; i < requiredProofs.length; i ++) {
      claim.proof_statuses[requiredProofs[i]] = false;
    }
    claim.isApproved = false;

    if (requiredProofs.length == 0) {
      approveClaim(claimer, nextClaimId);
    }

    nextClaimId ++;
    return nextClaimId - 1;
  }

  // Used by ProofSubmission
  // TODO only the last two arrays are being used in the frontend, reduce this methods return values or split off a slimmer method?
  function getClaim(uint claimId) public view returns(string memory, string memory,
    address, bool, uint, uint, string memory, address[] memory, bool[] memory) {
    // require(claims[claimId].claimer == msg.sender, "This claim was not submitted by the sender");

    Claim storage claim = claims[claimId];
    // This assumes the proof types are still the same as when the claim was submitted
    // We probably want to support an evolving set of proof types though? TODO
    address[] memory requiredProofTypes = getRequiredProofTypes();
    bool[] memory proofTypeStatuses = new bool[](requiredProofTypes.length);
    for (uint i = 0; i < requiredProofTypes.length; i ++) {
      proofTypeStatuses[i] = claim.proof_statuses[requiredProofTypes[i]];
    }

    return (name(), symbol(), claim.claimer, claim.isApproved,
      claim.quantity, claim.date, claim.comment, requiredProofTypes, proofTypeStatuses);
  }

  function getClaimInfo(uint claimId) public view returns(address, bool, uint, uint, string memory) {
    return (claims[claimId].claimer, claims[claimId].isApproved,
      claims[claimId].quantity, claims[claimId].date, claims[claimId].comment);
  }

  function getMyClaimIds() public view returns(uint[] memory) {
    return getClaimIds(msg.sender);
  }

  function getClaimIds(address claimer) private view returns(uint[] memory) {
    uint count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == claimer) {
          count ++;
      }
    }
    uint[] memory ids = new uint[](count);
    count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == claimer) {
          ids[count] = i;
          count ++;
      }
    }
    return ids;
  }

  // ------------------------- METHODS USED BY PROOF TYPES -------------------------

  // Used by the MinimumInterval proof type
  function getTimeBetweenThisClaimAndThatClaimersPreviousOne(address claimer, uint claimId) public view returns(uint) {
    uint[] memory ids = getClaimIds(claimer);
    if (ids.length < 2 || ids[0] == claimId) {
      return 365 * 24 * 60 * 60 * 1000; // a year as indicator that it's not applicable (can't do -1 unfortunately)
    }
    uint previousId;
    for (uint i = 0; i < ids.length; i ++) {
      if(ids[i] == claimId) {
          return claims[claimId].date - claims[previousId].date;
      }
      previousId = ids[i];
    }
  }

  // Used by the MaximumQuantityPerInterval proof type
  function sumUpQuantitiesWithinIntervalBeforeThisClaim(address claimer, uint claimId, uint interval) public view returns(uint, uint) {
    uint[] memory ids = getClaimIds(claimer);
    if (ids.length < 2 || ids[0] == claimId) {
      return (0, claims[claimId].quantity);
    }

    uint dateOfRequestingClaim = claims[claimId].date; // TODO check if that's actually the claimers claim
    uint sum = 0;

    for (uint i = 0; i < ids.length; i ++) {
      if (ids[i] != claimId && dateOfRequestingClaim - claims[ids[i]].date <= interval) {
          sum = sum + claims[ids[i]].quantity;
      }
    }

    return (sum, claims[claimId].quantity);
  }

  // ------------------------- PROOF TYPES -------------------------

  address[] public requiredProofTypes; // a subset of all existing ones linked to Fin4Main, defined by the action type creator

  // called from ProofType contracts, therefore msg.sender is the address of that SC
  function receiveProofApproval(address claimer, uint claimId) public returns(bool) {
    claims[claimId].proof_statuses[msg.sender] = true;
    if (_allProofTypesApprovedOnClaim(claimId)) {
      approveClaim(claimer, claimId);
    }
    return true;
  }

  function approveClaim(address claimer, uint claimId) private {
    claims[claimId].isApproved = true;
    // here the minting happens, actual change of balance
    // requires the proof type calling this method to have the Minter role on this Token
    // that was granted him in Fin4Main.createNewToken()
    // can alse be called from here (Fin4TokenBase) in case of no proof types required, therefore
    // Fin4TokenBase must also have the Minter role
    mint(claimer, claims[claimId].quantity);
    Fin4MainStub(Fin4Main).claimApprovedPingback(address(this), claimId);
  }

  function isMinter(address account) public view returns (bool);

  function addMinter(address account) public;

  function mint(address account, uint256 amount) public returns (bool);

  function _allProofTypesApprovedOnClaim(uint claimId) private view returns(bool) {
    for (uint i = 0; i < requiredProofTypes.length; i ++) {
      if (!claims[claimId].proof_statuses[requiredProofTypes[i]]) {
        return false;
      }
    }
    return true;
  }

  function getRequiredProofTypes() public view returns(address[] memory) {
    return requiredProofTypes;
  }

  // called for each proof type from Fin4Main.createNewToken()
  function addRequiredProofType(address proofType) public returns(bool) {
    require(Fin4MainStub(Fin4Main).proofTypeIsRegistered(proofType),
      "This address is not registered as proof type in Fin4Main");
    requiredProofTypes.push(proofType);
    Fin4BaseProofType(proofType).registerActionTypeCreator(actionTypeCreator);
    return true;
  }

}
