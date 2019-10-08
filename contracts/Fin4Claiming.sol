pragma solidity ^0.5.0;

import 'contracts/Fin4Token.sol';
import 'contracts/Fin4Main.sol';

contract Fin4Claiming {

    event ClaimSubmitted(address tokenAddr, uint claimId, address claimer, uint quantity, uint date, string comment,
        address[] requiredProofTypes);
    event ClaimApproved(address tokenAddr, uint claimId, address claimer, uint256 newBalance);
    event OneProofOnClaimApproval(address tokenAdrToReceiveProof, address proofTypeAddress, uint claimId, address claimer);

    address public Fin4MainAddress;

    constructor(address Fin4MainAddr) public {
        Fin4MainAddress = Fin4MainAddr;
    }

    struct ClaimRef {
        address token;
        uint claimId;
    }

    mapping (string => ClaimRef) public claimRefs;

    function submitClaim(address tokenAddress, uint quantity, uint date, string memory comment) public {
        Fin4Main(Fin4MainAddress).claimSubmissionPingback(msg.sender, tokenAddress);
        uint claimId;
        address[] memory requiredProofTypes;
        (claimId, requiredProofTypes) = Fin4Token(tokenAddress).submit(msg.sender, quantity, date, comment);
        emit ClaimSubmitted(tokenAddress, claimId, msg.sender, quantity, date, comment, requiredProofTypes);
    }

    function proofApprovalPingback(address tokenAdrToReceiveProof, address proofTypeAddress, uint claimId, address claimer) public {
        emit OneProofOnClaimApproval(tokenAdrToReceiveProof, proofTypeAddress, claimId, claimer);
    }

    // called from Fin4TokenBase
    function claimApprovedPingback(address tokenAddress, address claimer, uint claimId) public {
        emit ClaimApproved(tokenAddress, claimId, claimer, Fin4Token(tokenAddress).balanceOf(claimer));
    }

}
