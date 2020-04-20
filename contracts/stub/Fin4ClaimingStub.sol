pragma solidity ^0.5.0;

contract Fin4ClaimingStub {

    function claimApprovedPingback(address tokenAddress, address claimer, uint claimId, uint quantity, bool Fin4ClaimingHasMinterRole) public;

    function verifierApprovalPingback(address tokenAddrToReceiveVerifierDecision, address verifierTypeAddress, uint claimId, address claimer) public;

    function verifierAndClaimRejectionPingback(address tokenAddress, uint claimId, address claimer) public;

}
