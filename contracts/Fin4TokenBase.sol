pragma solidity ^0.5.0;

import 'contracts/Fin4Proving.sol';
import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/stub/Fin4ClaimingStub.sol";

contract Fin4TokenBase { // abstract class

  address public Fin4ClaimingAddress;
  address public Fin4ProvingAddress;
  address public tokenCreator;
  string public description;
  string public actionsText;
  string public unit; // TODO remove? repurpose?
  uint public tokenCreationTime;
  bool private initDone = false;
  uint public fixedQuantity;
  uint public userDefinedQuantityFactor;
  uint public initialSupply;

  constructor() public {
    tokenCreationTime = now;
  }

  function init(address Fin4ClaimingAddr, address Fin4ProvingAddr, string memory _description,
    string memory _actionsText, uint _fixedQuantity, uint _userDefinedQuantityFactor) public {
    require(!initDone, "init() can only be called once"); // TODO also require token creator?
    Fin4ClaimingAddress = Fin4ClaimingAddr;
    Fin4ProvingAddress = Fin4ProvingAddr;
    description = _description;
    actionsText = _actionsText;
    fixedQuantity = _fixedQuantity;
    userDefinedQuantityFactor = _userDefinedQuantityFactor;
    initDone = true;
  }

  function name() public view returns(string memory);
  function symbol() public view returns(string memory);

  // ------------------------- CLAIM -------------------------

  uint nextClaimId = 0;

	struct Claim {
    uint claimId;
    address claimer;
    bool isApproved;
    uint quantity;
    // uint timeGivenByUser; // TODO if useful? #ConceptualDecision
    string comment;
    address[] requiredProofTypes;
    mapping(address => bool) proofStatuses;
    mapping(address => uint) proofInteractionTimes;
    uint claimCreationTime;
    uint claimApprovalTime;
    bool gotRejected;
    address[] rejectedByProofTypes;
  }

	mapping (uint => Claim) public claims;

  // intentional forwarding like this so that the front end doesn't need to know which token to submit a claim to at the moment of submitting it
	function submitClaim(address claimer, uint userDefinedQuantity, string memory comment) public returns (uint, address[] memory, uint, uint) {
    require(tokenEnabled, "Token is not enabled");
    Claim storage claim = claims[nextClaimId];
    claim.claimCreationTime = now;
    claim.claimId = nextClaimId;
    claim.claimer = claimer;

    // a require() in Fin4TokenManagement.createNewToken() made sure they are not both zero or nonzero

    if (fixedQuantity != 0) {
      claim.quantity = fixedQuantity;
    }

    if (userDefinedQuantityFactor != 0) {
      claim.quantity = userDefinedQuantity * userDefinedQuantityFactor;
    }

    claim.comment = comment;
    // make a deep copy because the token creator might change the required proof types, but throughout the lifecycle of a claim they should stay fix
    // TODO should they? --> #ConceptualDecision
    claim.requiredProofTypes = getRequiredProofTypes();
    // initialize all the proofs required by the token creator with false
    // TODO isn't the default initialization false?
    for (uint i = 0; i < claim.requiredProofTypes.length; i ++) {
      claim.proofStatuses[claim.requiredProofTypes[i]] = false;
    }
    claim.isApproved = false;
    claim.gotRejected = false;

    if (claim.requiredProofTypes.length == 0) {
      approveClaim(nextClaimId);
    }

    nextClaimId ++;
    return (nextClaimId - 1, claim.requiredProofTypes, claim.claimCreationTime, claim.quantity);
  }

  function getClaim(uint claimId) public view returns(address, bool, bool, uint, uint, string memory, address[] memory, bool[] memory) {
    // require(claims[claimId].claimer == msg.sender, "This claim was not submitted by the sender");

    Claim storage claim = claims[claimId];
    // This assumes the proof types are still the same as when the claim was submitted
    // We probably want to support an evolving set of proof types though? TODO
    address[] memory requiredProofTypes = getRequiredProofTypes();
    bool[] memory proofTypeStatuses = new bool[](requiredProofTypes.length);
    for (uint i = 0; i < requiredProofTypes.length; i ++) {
      proofTypeStatuses[i] = claim.proofStatuses[requiredProofTypes[i]];
    }

    return (claim.claimer, claim.isApproved, claim.gotRejected, claim.quantity, claim.claimCreationTime,
      claim.comment, requiredProofTypes, proofTypeStatuses);
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
          return claims[claimId].claimCreationTime - claims[previousId].claimCreationTime;
      }
      previousId = ids[i];
    }
    // TODO fallback return?
  }

  // Used by the MaximumQuantityPerInterval proof type
  function sumUpQuantitiesWithinIntervalBeforeThisClaim(address claimer, uint claimId, uint interval) public view returns(uint, uint) {
    uint[] memory ids = getClaimIds(claimer);
    if (ids.length < 2 || ids[0] == claimId) {
      return (0, claims[claimId].quantity);
    }

    uint dateOfRequestingClaim = claims[claimId].claimCreationTime; // TODO check if that's actually the claimers claim
    uint sum = 0;

    for (uint i = 0; i < ids.length; i ++) {
      if (ids[i] != claimId && dateOfRequestingClaim - claims[ids[i]].claimCreationTime <= interval) {
          sum = sum + claims[ids[i]].quantity;
      }
    }

    return (sum, claims[claimId].quantity);
  }

  // ------------------------- PROOF TYPES -------------------------

  address[] public requiredProofTypes; // a subset of all existing ones linked to Fin4Main, defined by the token creator

  // called from ProofType contracts
  function receiveProofApproval(address proofTypeAddress, uint claimId) public {
    // TODO require something as guard?
    claims[claimId].proofStatuses[proofTypeAddress] = true;
    claims[claimId].proofInteractionTimes[proofTypeAddress] = now;
    Fin4ClaimingStub(Fin4ClaimingAddress).proofApprovalPingback(address(this), proofTypeAddress, claimId, claims[claimId].claimer);
    if (_allProofTypesApprovedOnClaim(claimId)) {
      approveClaim(claimId);
    }
  }

  function receiveProofRejection(address proofTypeAddress, uint claimId) public {
    // can there be multiple interaction times per proof type?
    claims[claimId].proofInteractionTimes[proofTypeAddress] = now;
    // also store reason here? Or enough to send as message to the user from the proof type as is done currently?
    claims[claimId].rejectedByProofTypes.push(proofTypeAddress);
    if (!claims[claimId].gotRejected) {
      claims[claimId].gotRejected = true;
      Fin4ClaimingStub(Fin4ClaimingAddress).proofAndClaimRejectionPingback(address(this), claimId, claims[claimId].claimer);
    }
  }

  function approveClaim(uint claimId) private {
    claims[claimId].isApproved = true;
    claims[claimId].claimApprovalTime = now;
    Fin4ClaimingStub(Fin4ClaimingAddress).claimApprovedPingback(address(this), claims[claimId].claimer, claimId, claims[claimId].quantity);
  }

  function isMinter(address account) public view returns (bool);

  function addMinter(address account) public;

  function renounceMinter() public;

  function mint(address account, uint256 amount) public returns (bool);

  function _allProofTypesApprovedOnClaim(uint claimId) private view returns(bool) {
    for (uint i = 0; i < requiredProofTypes.length; i ++) {
      if (!claims[claimId].proofStatuses[requiredProofTypes[i]]) {
        return false;
      }
    }
    return true;
  }

  function getRequiredProofTypes() public view returns(address[] memory) {
    return requiredProofTypes;
  }

  // called for each proof type from Fin4Main.createNewToken()
  function addRequiredProofType(address proofType) public {
    require(Fin4Proving(Fin4ProvingAddress).proofTypeIsRegistered(proofType),
      "This address is not registered as proof type in Fin4Proving");
    requiredProofTypes.push(proofType);
    Fin4BaseProofType(proofType).registerTokenCreator(tokenCreator);
    if (Fin4BaseProofType(proofType).hasParameterForTokenCreatorToSet()) {
      tokenEnabled = false;
      paramProofs.push(proofType);
      paramProofsPingbacked[proofType] = false;
    }
  }

  // used only as blocker in submitClaim() so far #ConceptualDecision use at more places?
  // Only makes sense though if something can set tokenEnabled to false later on...
  bool public tokenEnabled = true;
  address[] public paramProofs; // requiredProofTypes where the token creator had to set a parameter
  mapping(address => bool) public paramProofsPingbacked; // the token can only be enabled once all of these are true

  function proofContractParameterizedPingback() public {
    paramProofsPingbacked[msg.sender] = true;
    if (_allParamProofsPingbacked()) {
      tokenEnabled = true;
    }
  }

  function _allParamProofsPingbacked() private view returns(bool) {
    for (uint i = 0; i < paramProofs.length; i ++) {
      if (paramProofsPingbacked[paramProofs[i]] == false) {
        return false;
      }
    }
    return true;
  }

  function getUnrejectedClaimsWithThisProofTypeUnapproved(address proofType) public view returns(uint[] memory, address[] memory) {
    uint count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (!claims[i].gotRejected && proofTypeIsRequired(proofType, i) && !claims[i].proofStatuses[proofType]) {
        count ++;
      }
    }
    uint[] memory claimIDs = new uint[](count);
    address[] memory claimers = new address[](count);
    count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (!claims[i].gotRejected && proofTypeIsRequired(proofType, i) && !claims[i].proofStatuses[proofType]) {
        claimIDs[count] = i;
        claimers[count] = claims[i].claimer;
        count ++;
      }
    }
    return (claimIDs, claimers);
  }

  function proofTypeIsRequired(address proofType, uint claimId) public view returns(bool) {
    for (uint i = 0; i < claims[claimId].requiredProofTypes.length; i ++) {
      if (claims[claimId].requiredProofTypes[i] == proofType) {
          return true;
      }
    }
    return false;
  }
}
