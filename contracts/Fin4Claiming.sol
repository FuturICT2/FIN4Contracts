pragma solidity ^0.5.17;

import 'contracts/Fin4Token.sol';
import 'contracts/Fin4SystemParameters.sol';
import 'contracts/stub/MintTransferStub.sol';
import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Underlyings.sol";

contract Fin4Claiming {

    event ClaimSubmitted(address tokenAddr, uint claimId, address claimer, uint quantity, uint claimCreationTime,
        string comment, address[] requiredVerifierTypes);
    event ClaimApproved(address tokenAddr, uint claimId, address claimer, uint mintedQuantity, uint256 newBalance);
    event ClaimRejected(address tokenAddr, uint claimId, address claimer);
    event VerifierPending(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress, uint claimId,
        address claimer, string message);
    event VerifierApproved(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress, uint claimId,
        address claimer, string message);
    event VerifierRejected(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress, uint claimId,
        address claimer, string message);
    event UpdatedTotalSupply(address tokenAddr, uint256 totalSupply);

    /* If we go for the DNS pattern of this contract as Mark suggested #ConceptualDecision
    struct ClaimRef {
        address token;
        uint claimId;
    }
    mapping (string => ClaimRef) public claimRefs; */

    address public creator;
    address public Fin4SystemParametersAddress;
    address public Fin4UnderlyingsAddress;
    address public Fin4ReputationAddress;

    constructor(address Fin4SystemParametersAddr, address Fin4UnderlyingsAddr) public {
        creator = msg.sender;
        Fin4SystemParametersAddress = Fin4SystemParametersAddr;
        Fin4UnderlyingsAddress = Fin4UnderlyingsAddr;
    }

    function setFin4ReputationAddress(address Fin4ReputationAddr) public {
        require(msg.sender == creator, "Only the creator of this smart contract can call this function");
        Fin4ReputationAddress = Fin4ReputationAddr;
    }

    function submitClaim(address tokenAddress, uint variableAmount, string memory comment) public {
        uint claimId;
        address[] memory requiredVerifierTypes;
        uint claimCreationTime;
        uint quantity;
        (claimId, requiredVerifierTypes, claimCreationTime, quantity) = Fin4Token(tokenAddress)
            .submitClaim(msg.sender, variableAmount, comment);

        if (!userClaimedOnThisTokenAlready(msg.sender, tokenAddress)) {
            tokensWhereUserHasClaims[msg.sender].push(tokenAddress);
        }

        emit ClaimSubmitted(tokenAddress, claimId, msg.sender, quantity, claimCreationTime, comment, requiredVerifierTypes);

        for (uint i = 0; i < requiredVerifierTypes.length; i++) {
            if (Fin4BaseVerifierType(requiredVerifierTypes[i]).isNoninteractive()) {
                // Also emit VerifierPending? For now they decide immediately and so the VerifierApprove/Rejected event will follow
                // as soon as there is some time delay (asking oracle etc.) the VerifierPending should probably be emitted
                Fin4BaseVerifierType(requiredVerifierTypes[i]).autoCheck(msg.sender, tokenAddress, claimId);
            }
        }

        // Only auto-init applicable verifier types if the claim didn't already got automatically rejected from a constraint in the previous loop
        if (!Fin4Token(tokenAddress).claimGotRejected(claimId)) {
            // auto-init claims where user would only press an "init verifier" button without having to supply more info
            for (uint i = 0; i < requiredVerifierTypes.length; i++) {
                // TODO instead of two calls, make .autoSubmitProofIfApplicable()?
                if (Fin4BaseVerifierType(requiredVerifierTypes[i]).isAutoInitiable()) {
                    Fin4BaseVerifierType(requiredVerifierTypes[i]).autoSubmitProof(msg.sender, tokenAddress, claimId);
                }
            }
        }
    }

    function verifierPendingPingback(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress, uint claimId,
        address claimer, string memory message) public {
        emit VerifierPending(tokenAddrToReceiveVerifierNotice, verifierTypeAddress, claimId, claimer, message);
    }

    function verifierApprovalPingback(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress, uint claimId,
        address claimer, string memory message) public {
        emit VerifierApproved(tokenAddrToReceiveVerifierNotice, verifierTypeAddress, claimId, claimer, message);
    }

    function verifierRejectionPingback(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress, uint claimId,
        address claimer, string memory message) public {
        emit VerifierRejected(tokenAddrToReceiveVerifierNotice, verifierTypeAddress, claimId, claimer, message);
    }

    // called from Fin4TokenBase
    function claimApprovedPingback(address tokenAddress, address claimer, uint claimId, uint quantity, bool canMint) public {
        // TODO require...

        if (canMint) {
            // TODO verify this makes sense and msg.sender is the token
            MintTransferStub(tokenAddress).mint(claimer, quantity);
            // can changes to totalSupply happen at other places too though? Definitely if we use the
            // ERC20Plus contract with burning for instance... #ConceptualDecision
            emit UpdatedTotalSupply(tokenAddress, Fin4Token(tokenAddress).totalSupply());
        }

        Fin4Underlyings(Fin4UnderlyingsAddress).callSuccessfulClaimNotifiers(tokenAddress, claimer, quantity);

        // listen to this event if you provide your own minting policy
        emit ClaimApproved(tokenAddress, claimId, claimer, quantity, Fin4Token(tokenAddress).balanceOf(claimer));

        // REP reward for a successful claim
        MintTransferStub(Fin4ReputationAddress).mint(claimer, Fin4SystemParameters(Fin4SystemParametersAddress).REPforTokenClaim());
    }

    function claimRejectionPingback(address tokenAddress, uint claimId, address claimer) public {
        emit ClaimRejected(tokenAddress, claimId, claimer);
    }

    // ------------------------- TOKENS WHERE USER HAS CLAIMS -------------------------

    // to keep track on which tokens the user has claims (independent of their approval-statuses)
    mapping (address => address[]) public tokensWhereUserHasClaims; // key = user, value = token addresses

    function userClaimedOnThisTokenAlready(address user, address tokenAddress) private view returns (bool) {
        for (uint i = 0; i < tokensWhereUserHasClaims[user].length; i++) {
            if (tokensWhereUserHasClaims[user][i] == tokenAddress) {
                return true;
            }
        }
        return false;
    }

    // used in PreviousClaims
    function getTokensWhereUserHasClaims() public view returns(address[] memory) {
        return tokensWhereUserHasClaims[msg.sender];
    }

    // ------------------------- CLAIMS -------------------------

    function getMyClaimIdsOnThisToken(address token) public view returns(uint[] memory) {
        return Fin4Token(token).getClaimIds(msg.sender);
    }

    function getClaimOnThisToken(address token, uint claimId) public view
        returns(address, bool, bool, uint, uint, string memory, address[] memory, uint[] memory, address[] memory) {
        return Fin4Token(token).getClaim(claimId);
    }

    function getVerifierMessageOnClaim(address token, uint claimId, address verifierAddress) public view returns(string memory) {
        return Fin4Token(token).getVerifierMessageOnClaim(claimId, verifierAddress);
    }

}
