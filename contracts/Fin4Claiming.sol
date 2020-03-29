pragma solidity ^0.5.0;

import 'contracts/Fin4Token.sol';
import 'contracts/Fin4SystemParameters.sol';
import 'contracts/stub/MintingStub.sol';
import "contracts/proof/Fin4BaseProofType.sol";

contract Fin4Claiming {

    event ClaimSubmitted(address tokenAddr, uint claimId, address claimer, uint quantity, uint claimCreationTime,
        string comment, address[] requiredProofTypes);
    event ClaimApproved(address tokenAddr, uint claimId, address claimer, uint mintedQuantity, uint256 newBalance);
    event ClaimRejected(address tokenAddr, uint claimId, address claimer);
    event ProofApproved(address tokenAddrToReceiveProof, address proofTypeAddress, uint claimId, address claimer);
    event UpdatedTotalSupply(address tokenAddr, uint256 totalSupply);

    /* If we go for the DNS pattern of this contract as Mark suggested #ConceptualDecision
    struct ClaimRef {
        address token;
        uint claimId;
    }
    mapping (string => ClaimRef) public claimRefs; */

    address public creator;
    address public Fin4SystemParametersAddress;
    address public Fin4ReputationAddress;

    constructor(address Fin4SystemParametersAddr) public {
        creator = msg.sender;
        Fin4SystemParametersAddress = Fin4SystemParametersAddr;
    }

    function setFin4ReputationAddress(address Fin4ReputationAddr) public {
        require(msg.sender == creator, "Only the creator of this smart contract can call this function");
        Fin4ReputationAddress = Fin4ReputationAddr;
    }

    function submitClaim(address tokenAddress, uint variableAmount, string memory comment) public {
        uint claimId;
        address[] memory requiredProofTypes;
        uint claimCreationTime;
        uint quantity;
        (claimId, requiredProofTypes, claimCreationTime, quantity) = Fin4Token(tokenAddress)
            .submitClaim(msg.sender, variableAmount, comment);

        if (!userClaimedOnThisActionAlready(msg.sender, tokenAddress)) {
            actionsWhereUserHasClaims[msg.sender].push(tokenAddress);
        }

        emit ClaimSubmitted(tokenAddress, claimId, msg.sender, quantity, claimCreationTime, comment, requiredProofTypes);

        // auto-init claims where user would only press an "init proof" button without having to supply more info
        for (uint i = 0; i < requiredProofTypes.length; i++) {
            // TODO instead of two calls, make .autoSubmitProofIfApplicable()?
            if (Fin4BaseProofType(requiredProofTypes[i]).isAutoInitiable()) {
                Fin4BaseProofType(requiredProofTypes[i]).autoSubmitProof(msg.sender, tokenAddress, claimId);
            }
        }
    }

    function proofApprovalPingback(address tokenAddrToReceiveProof, address proofTypeAddress, uint claimId, address claimer) public {
        emit ProofApproved(tokenAddrToReceiveProof, proofTypeAddress, claimId, claimer);
    }

    // called from Fin4TokenBase
    function claimApprovedPingback(address tokenAddress, address claimer, uint claimId, uint quantity, bool canMint) public {
        // TODO require...

        if (canMint) {
            // TODO verify this makes sense and msg.sender is the token
            MintingStub(tokenAddress).mint(claimer, quantity);
            // can changes to totalSupply happen at other places too though? Definitely if we use the
            // ERC20Plus contract with burning for instance... #ConceptualDecision
            emit UpdatedTotalSupply(tokenAddress, Fin4Token(tokenAddress).totalSupply());
        }

        emit ClaimApproved(tokenAddress, claimId, claimer, quantity, Fin4Token(tokenAddress).balanceOf(claimer));

        // REP reward for a successful claim
        MintingStub(Fin4ReputationAddress).mint(claimer, Fin4SystemParameters(Fin4SystemParametersAddress).REPforTokenClaim());
    }

    function proofAndClaimRejectionPingback(address tokenAddress, uint claimId, address claimer) public {
        emit ClaimRejected(tokenAddress, claimId, claimer);
    }

    // ------------------------- ACTION WHERE USER HAS CLAIMS -------------------------

    // to keep track on which tokens the user has claims (independent of their approval-statuses)
    mapping (address => address[]) public actionsWhereUserHasClaims; // key = user, value = action addresses

    function userClaimedOnThisActionAlready(address user, address action) private view returns (bool) {
        for (uint i = 0; i < actionsWhereUserHasClaims[user].length; i++) {
            if (actionsWhereUserHasClaims[user][i] == action) {
                return true;
            }
        }
        return false;
    }

    // used in PreviousClaims
    function getActionsWhereUserHasClaims() public view returns(address[] memory) {
        return actionsWhereUserHasClaims[msg.sender];
    }

    // ------------------------- CLAIM IDS -------------------------

    function getMyClaimIdsOnThisToken(address token) public view returns(uint[] memory) {
        return Fin4Token(token).getClaimIds(msg.sender);
    }

    function getClaimOnThisToken(address token, uint claimId) public view
        returns(address, bool, bool, uint, uint, string memory, address[] memory, bool[] memory) {
        return Fin4Token(token).getClaim(claimId);
    }
}
