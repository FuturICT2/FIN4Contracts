pragma solidity ^0.5.0;

contract Fin4ClaimingStub {

    function claimApprovedPingback(address tokenAddress, address claimer, uint claimId, uint quantity, bool Fin4ClaimingHasMinterRole) public;

    function verifierApprovalPingback(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress,
        uint claimId, address claimer, string memory message) public;

    function verifierRejectionPingback(address tokenAddrToReceiveVerifierNotice, address verifierTypeAddress,
        uint claimId, address claimer, string memory message) public;

    function claimRejectionPingback(address tokenAddress, uint claimId, address claimer) public;

}
