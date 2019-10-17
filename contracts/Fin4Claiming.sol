pragma solidity ^0.5.0;

import 'contracts/Fin4Token.sol';

contract Fin4Claiming {

    event ClaimSubmitted(address tokenAddr, uint claimId, address claimer, uint quantity, uint date, string comment,
        address[] requiredProofTypes);
    event ClaimApproved(address tokenAddr, uint claimId, address claimer, uint256 newBalance);
    event ProofApproved(address tokenAdrToReceiveProof, address proofTypeAddress, uint claimId, address claimer);
    event UpdatedTotalSupply(address tokenAddr, uint256 totalSupply);

    /*
    struct ClaimRef {
        address token;
        uint claimId;
    }

    mapping (string => ClaimRef) public claimRefs;
    */

    function submitClaim(address tokenAddress, uint quantity, uint date, string memory comment) public {
        if (!userClaimedOnThisActionAlready(msg.sender, tokenAddress)) {
            actionsWhereUserHasClaims[msg.sender].push(tokenAddress);
        }
        uint claimId;
        address[] memory requiredProofTypes;
        (claimId, requiredProofTypes) = Fin4Token(tokenAddress).submitClaim(msg.sender, quantity, date, comment);
        emit ClaimSubmitted(tokenAddress, claimId, msg.sender, quantity, date, comment, requiredProofTypes);
    }

    function proofApprovalPingback(address tokenAdrToReceiveProof, address proofTypeAddress, uint claimId, address claimer) public {
        emit ProofApproved(tokenAdrToReceiveProof, proofTypeAddress, claimId, claimer);
    }

    // called from Fin4TokenBase
    function claimApprovedPingback(address tokenAddress, address claimer, uint claimId) public {
        emit ClaimApproved(tokenAddress, claimId, claimer, Fin4Token(tokenAddress).balanceOf(claimer));
        // can changes to totalSupply happen at other places too though? Definitely if we use the
        // AllPurpose contract with burning for instance... #ConceptualDecision
        emit UpdatedTotalSupply(tokenAddress, Fin4Token(tokenAddress).totalSupply());
    }

    // ------------------------- ACTION WHERE USER HAS CLAIMS -------------------------

    // to keep track on which action types the user has claims (independent of their approval-statuses)
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
        returns(address, bool, uint, uint, string memory, address[] memory, bool[] memory) {
        return Fin4Token(token).getClaim(claimId);
    }

}
