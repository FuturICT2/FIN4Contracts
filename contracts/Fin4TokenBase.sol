pragma solidity ^0.5.17;

import 'contracts/Fin4Verifying.sol';
import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/stub/Fin4ClaimingStub.sol";

contract Fin4TokenBase { // abstract class

    address public Fin4ClaimingAddress;
    address public tokenCreator;
    string public description;
    string public actionsText;
    string public unit;
    uint public tokenCreationTime;
    uint public fixedAmount;
    uint public initialSupply;
    address public initialSupplyOwner;

    bool private initDone = false;
    bool private Fin4ClaimingHasMinterRole = true;

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

    function name() public view returns(string memory);
    function symbol() public view returns(string memory);

    function getTokenCreator() public view returns(address) {
        return tokenCreator;
    }

    address[] public addressesWithMinterRoles;

    function storeAddressesWithMinterRole(address[] memory minters) public {
        addressesWithMinterRoles = minters;
    }

    function getInitialSupplyOwnerAndMinterRoles() internal view returns(address[] memory) {
        address[] memory initialSupplyOwnerAndMinterRoles = new address[](1 + addressesWithMinterRoles.length);
        initialSupplyOwnerAndMinterRoles[0] = initialSupplyOwner;
        for (uint i = 0; i < addressesWithMinterRoles.length; i++) {
            initialSupplyOwnerAndMinterRoles[1 + i] = addressesWithMinterRoles[i];
        }
        return initialSupplyOwnerAndMinterRoles;
    }

    // ------------------------- CLAIM -------------------------

    // ProofAndVerifierStatusEnum
    enum Status { UNSUBMITTED, PENDING, APPROVED, REJECTED } // from https://ethereum.stackexchange.com/a/24087/56047

    struct StatusObj {
        Status status;
        string message;
    }

    uint nextClaimId = 0;

    struct Claim {
        uint claimId;
        address claimer;
        bool isApproved;
        uint quantity;
        // uint timeGivenByUser; // TODO if useful? #ConceptualDecision
        string comment;
        address[] requiredVerifierTypes;
        mapping(address => StatusObj) verifierStatuses;
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
            StatusObj memory statusObj = StatusObj(Status.UNSUBMITTED, "");
            claim.verifierStatuses[claim.requiredVerifierTypes[i]] = statusObj;
        }
        claim.isApproved = false;
        claim.gotRejected = false;

        if (claim.requiredVerifierTypes.length == 0) {
            approveClaim(nextClaimId);
        }

        nextClaimId ++;
        return (nextClaimId - 1, claim.requiredVerifierTypes, claim.claimCreationTime, claim.quantity);
    }

    function getClaim(uint claimId) public view returns(address, bool, bool, uint, uint, string memory, address[] memory,
        uint[] memory, address[] memory) {
        // require(claims[claimId].claimer == msg.sender, "This claim was not submitted by the sender");

        Claim storage claim = claims[claimId];
        // This assumes the verifier types are still the same as when the claim was submitted
        // We probably want to support an evolving set of verifier types though? TODO
        address[] memory requiredVerifierTypes = getRequiredVerifierTypes();
        uint[] memory verifierTypeStatuses = new uint[](requiredVerifierTypes.length);
        for (uint i = 0; i < requiredVerifierTypes.length; i ++) {
            verifierTypeStatuses[i] = uint(claim.verifierStatuses[requiredVerifierTypes[i]].status);
        }

        address[] memory verifiersWithMessages = new address[](requiredVerifierTypes.length);
        uint count = 0;
        for (uint i = 0; i < requiredVerifierTypes.length; i ++) {
            if (bytes(claim.verifierStatuses[requiredVerifierTypes[i]].message).length > 0) {
                verifiersWithMessages[count] = requiredVerifierTypes[i];
                count ++;
            }
        }

        return (claim.claimer, claim.isApproved, claim.gotRejected, claim.quantity, claim.claimCreationTime,
            claim.comment, requiredVerifierTypes, verifierTypeStatuses, verifiersWithMessages);
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

    function getVerifierMessageOnClaim(uint claimId, address verifierAddress) public view returns(string memory) {
        return claims[claimId].verifierStatuses[verifierAddress].message;
    }

    // ------------------------- METHODS USED BY VERIFIER TYPES -------------------------

    // function getTimeBetweenThisClaimAndThatClaimersPreviousOne archived in MinimumInterval
    // function sumUpQuantitiesWithinIntervalBeforeThisClaim archived in MaximumQuantityPerInterval

    function countApprovedClaimsOfThisUser(address user) public view returns(uint) {
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

    function receiveVerifierPendingNotice(address verifierTypeAddress, uint claimId, string memory message) public {
        claims[claimId].verifierStatuses[verifierTypeAddress].status = Status.PENDING;
        claims[claimId].verifierStatuses[verifierTypeAddress].message = message;
        Fin4ClaimingStub(Fin4ClaimingAddress).verifierPendingPingback(address(this), verifierTypeAddress, claimId,
            claims[claimId].claimer, message);
    }

    // called from verifierType contracts
    function receiveVerifierApprovalNotice(address verifierTypeAddress, uint claimId, string memory message) public {
        // TODO require something as guard?
        claims[claimId].verifierStatuses[verifierTypeAddress].status = Status.APPROVED;
        claims[claimId].verifierStatuses[verifierTypeAddress].message = message;
        Fin4ClaimingStub(Fin4ClaimingAddress).verifierApprovalPingback(address(this), verifierTypeAddress, claimId,
            claims[claimId].claimer, message);
        if (_allVerifierTypesApprovedOnClaim(claimId)) {
            approveClaim(claimId);
        }
    }

    function receiveVerifierRejectionNotice(address verifierTypeAddress, uint claimId, string memory message) public {
        claims[claimId].verifierStatuses[verifierTypeAddress].status = Status.REJECTED;
        claims[claimId].verifierStatuses[verifierTypeAddress].message = message;
        Fin4ClaimingStub(Fin4ClaimingAddress).verifierRejectionPingback(address(this), verifierTypeAddress, claimId,
            claims[claimId].claimer, message);
        if (!claims[claimId].gotRejected) {
            claims[claimId].gotRejected = true;
            Fin4ClaimingStub(Fin4ClaimingAddress).claimRejectionPingback(address(this), claimId, claims[claimId].claimer);
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
            if (claims[claimId].verifierStatuses[requiredVerifierTypes[i]].status != Status.APPROVED) {
                return false;
            }
        }
        return true;
    }

    function getRequiredVerifierTypes() public view returns(address[] memory) {
        return requiredVerifierTypes;
    }

    function addVerifierTypes(address[] memory _requiredVerifierTypes) public {
        requiredVerifierTypes = _requiredVerifierTypes;
        // TODO check if verifierTypeIsRegistered()
    }

    // function getUnrejectedClaimsWithThisverifierTypeUnapproved archived in SensorOneTimeSignal

    /* // used in SensorOneTimeSignal
    function verifierTypeIsRequired(address verifierType, uint claimId) public view returns(bool) {
        for (uint i = 0; i < claims[claimId].requiredVerifierTypes.length; i ++) {
            if (claims[claimId].requiredVerifierTypes[i] == verifierType) {
                    return true;
            }
        }
        return false;
    }
    */
}
