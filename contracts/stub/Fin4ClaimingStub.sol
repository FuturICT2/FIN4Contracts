pragma solidity ^0.5.0;

contract Fin4ClaimingStub {

    function claimApprovedPingback(address tokenAddress, address claimer, uint claimId) public;

    function proofApprovalPingback(address tokenAddrToReceiveProof, address proofTypeAddress, uint claimId, address claimer) public;

}
