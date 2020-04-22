pragma solidity ^0.5.0;

contract Fin4ClaimingStub {

    function claimApprovedPingback(address tokenAddress, address claimer, uint claimId, uint quantity, bool Fin4ClaimingHasMinterRole) public;

    function verifierApprovalPingback(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress,
        uint claimId, address claimer) public;

    function verifierRejectionPingback(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress,
        uint claimId, address claimer) public;

    function verifierAndClaimRejectionPingback(address tokenAddress, uint claimId, address claimer) public;

}
