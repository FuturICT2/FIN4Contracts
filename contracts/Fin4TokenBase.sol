pragma solidity ^0.5.0;

import 'contracts/Fin4Verifying.sol';
import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/stub/Fin4ClaimingStub.sol";

contract Fin4TokenBase { // abstract class

  address public Fin4ClaimingAddress;
  address public Fin4VerifyingAddress;
  address public tokenCreator;
  string public description;
  string public actionsText;
  string public unit;
  uint public tokenCreationTime;
  uint public fixedAmount;
  uint public initialSupply;

  bool private initDone = false;
  bool private Fin4ClaimingHasMinterRole = true;

  // TODO instead of keeping copies here, instead just store indizes
  // of the array in Fin4TokenManagement?
  bytes32[] public underlyings;

  constructor() public {
    tokenCreationTime = now;
  }

  function init(address Fin4ClaimingAddr, bool _Fin4ClaimingHasMinterRole, string memory _description, string memory _actionsText,
    uint _fixedAmount, string memory _unit) public {
    require(!initDone, "init() can only be called once"); // TODO also require token creator?
    Fin4ClaimingAddress = Fin4ClaimingAddr;
    Fin4ClaimingHasMinterRole = _Fin4ClaimingHasMinterRole;
    description = _description;
    actionsText = _actionsText;
    fixedAmount = _fixedAmount;
    unit = _unit;
    initDone = true;
  }

  function setUnderlyingsOnToken(bytes32[] memory _underlyings) public {
    underlyings = _underlyings;
  }

  function getUnderlyingsOnToken() public view returns(bytes32[] memory) {
    return underlyings;
  }

  function name() public view returns(string memory);
  function symbol() public view returns(string memory);

  // ------------------------- CLAIM -------------------------

  // ProofAndVerifierStatusEnum
  enum Status { UNSUBMITTED, PENDING, APPROVED, REJECTED } // from https://ethereum.stackexchange.com/a/24087/56047

  uint nextClaimId = 0;

	struct Claim {
    uint claimId;
    address claimer;
    bool isApproved;
    uint quantity;
    // uint timeGivenByUser; // TODO if useful? #ConceptualDecision
    string comment;
    address[] requiredVerifierTypes;
    mapping(address => Status) verifierStatuses;
    mapping(address => uint) verifierInteractionTimes;
    uint claimCreationTime;
    uint claimApprovalTime;
    bool gotRejected;
  }

	mapping (uint => Claim) public claims;

  // intentional forwarding like this so that the front end doesn't need to know which token to submit a claim to at the moment of submitting it
	function submitClaim(address claimer, uint variableAmount, string memory comment) public returns (uint, address[] memory, uint, uint) {
    require(initDone, "Token is not initialized");
    Claim storage claim = claims[nextClaimId];
    claim.claimCreationTime = now;
    claim.claimId = nextClaimId;
    claim.claimer = claimer;

    // a require() in Fin4TokenManagement.createNewToken() made sure they are not both zero or nonzero

    if (fixedAmount == 0) {
      claim.quantity = variableAmount;
    } else {
      claim.quantity = fixedAmount;
    }

    claim.comment = comment;
    // make a deep copy because the token creator might change the required verifier types, but throughout the lifecycle of a claim they should stay fix
    // TODO should they? --> #ConceptualDecision
    claim.requiredVerifierTypes = getRequiredVerifierTypes();

    for (uint i = 0; i < claim.requiredVerifierTypes.length; i ++) {
      claim.verifierStatuses[claim.requiredVerifierTypes[i]] = Status.UNSUBMITTED;
    }
    claim.isApproved = false;
    claim.gotRejected = false;

    if (claim.requiredVerifierTypes.length == 0) {
      approveClaim(nextClaimId);
    }

    nextClaimId ++;
    return (nextClaimId - 1, claim.requiredVerifierTypes, claim.claimCreationTime, claim.quantity);
  }

  function getClaim(uint claimId) public view returns(address, bool, bool, uint, uint, string memory, address[] memory, uint[] memory) {
    // require(claims[claimId].claimer == msg.sender, "This claim was not submitted by the sender");

    Claim storage claim = claims[claimId];
    // This assumes the verifier types are still the same as when the claim was submitted
    // We probably want to support an evolving set of verifier types though? TODO
    address[] memory requiredVerifierTypes = getRequiredVerifierTypes();
    uint[] memory verifierTypeStatuses = new uint[](requiredVerifierTypes.length);
    for (uint i = 0; i < requiredVerifierTypes.length; i ++) {
      verifierTypeStatuses[i] = uint(claim.verifierStatuses[requiredVerifierTypes[i]]);
    }

    return (claim.claimer, claim.isApproved, claim.gotRejected, claim.quantity, claim.claimCreationTime,
      claim.comment, requiredVerifierTypes, verifierTypeStatuses);
  }

  function getClaimInfo(uint claimId) public view returns(address, bool, uint, uint, string memory) {
    return (claims[claimId].claimer, claims[claimId].isApproved,
      claims[claimId].quantity, claims[claimId].claimCreationTime, claims[claimId].comment);
  }

  function getClaimIds(address claimer) public view returns(uint[] memory) {
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

  function claimGotRejected(uint claimId) public view returns(bool) {
    return claims[claimId].gotRejected;
  }

  // ------------------------- METHODS USED BY VERIFIER TYPES -------------------------

  // function getTimeBetweenThisClaimAndThatClaimersPreviousOne archived in MinimumInterval
  // function sumUpQuantitiesWithinIntervalBeforeThisClaim archived in MaximumQuantityPerInterval

  function countApprovedClaimsOfThisUser(address user) public returns(uint) {
    uint count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == user && claims[i].isApproved == true) {
        count ++;
      }
    }
    return count;
  }

  // ------------------------- VERIFIER TYPES -------------------------

  address[] public requiredVerifierTypes;

  function receiveVerifierPendingNotice(address verifierTypeAddress, uint claimId) public {
    claims[claimId].verifierStatuses[verifierTypeAddress] = Status.PENDING;
    // include that in verifierInteractionTimes? How?

    // decided not to forward this to Fin4Claiming and dispatch an event there,
    // frontend should set status of verifier to pending as soon as something that can be pending
    // (e.g. someone else has to approve) is submitted
  }

  // called from verifierType contracts
  function receiveVerifierApproval(address verifierTypeAddress, uint claimId) public {
    // TODO require something as guard?
    claims[claimId].verifierStatuses[verifierTypeAddress] = Status.APPROVED;
    claims[claimId].verifierInteractionTimes[verifierTypeAddress] = now;
    Fin4ClaimingStub(Fin4ClaimingAddress).verifierApprovalPingback(address(this), verifierTypeAddress, claimId, claims[claimId].claimer);
    if (_allVerifierTypesApprovedOnClaim(claimId)) {
      approveClaim(claimId);
    }
  }

  function receiveVerifierRejection(address verifierTypeAddress, uint claimId) public {
    claims[claimId].verifierStatuses[verifierTypeAddress] = Status.REJECTED;
    // can there be multiple interaction times per verifier type?
    claims[claimId].verifierInteractionTimes[verifierTypeAddress] = now;
    if (!claims[claimId].gotRejected) {
      claims[claimId].gotRejected = true;
      Fin4ClaimingStub(Fin4ClaimingAddress).verifierAndClaimRejectionPingback(address(this), claimId, claims[claimId].claimer);
    }
  }

  function approveClaim(uint claimId) private {
    claims[claimId].isApproved = true;
    claims[claimId].claimApprovalTime = now;
    Fin4ClaimingStub(Fin4ClaimingAddress).claimApprovedPingback(address(this), claims[claimId].claimer, claimId,
      claims[claimId].quantity, Fin4ClaimingHasMinterRole);
  }

  function isMinter(address account) public view returns (bool);

  function addMinter(address account) public;

  function renounceMinter() public;

  function mint(address account, uint256 amount) public returns (bool);

  function _allVerifierTypesApprovedOnClaim(uint claimId) private view returns(bool) {
    for (uint i = 0; i < requiredVerifierTypes.length; i ++) {
      if (claims[claimId].verifierStatuses[requiredVerifierTypes[i]] != Status.APPROVED) {
        return false;
      }
    }
    return true;
  }

  function getRequiredVerifierTypes() public view returns(address[] memory) {
    return requiredVerifierTypes;
  }

  function addverifierTypes(address Fin4VerifyingAddr, address[] memory _requiredVerifierTypes) public {
    Fin4VerifyingAddress = Fin4VerifyingAddr;
    Fin4Verifying verifying = Fin4Verifying(Fin4VerifyingAddress);

    for (uint i = 0; i < _requiredVerifierTypes.length; i++) {
      address verifierType = _requiredVerifierTypes[i];

      require(verifying.verifierTypeIsRegistered(verifierType), "This address is not registered as verifier type in Fin4Verifying");
      requiredVerifierTypes.push(verifierType);
      Fin4BaseVerifierType(verifierType).registerTokenCreator(tokenCreator);
    }
  }

  // function getUnrejectedClaimsWithThisverifierTypeUnapproved archived in SensorOneTimeSignal

  function verifierTypeIsRequired(address verifierType, uint claimId) public view returns(bool) {
    for (uint i = 0; i < claims[claimId].requiredVerifierTypes.length; i ++) {
      if (claims[claimId].requiredVerifierTypes[i] == verifierType) {
          return true;
      }
    }
    return false;
  }
}
