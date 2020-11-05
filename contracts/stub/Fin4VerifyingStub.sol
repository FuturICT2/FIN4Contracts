pragma solidity ^0.5.17;

contract Fin4VerifyingStub {
    // Voting Interaction
    function receiveApprovalFromSpecificAddress(uint param1, address param2, string memory param3) public;
    function receiveRejectionFromSpecificAddress(uint param1, address param2, string memory param3) public;
    function endVote(uint claimId) public;
}
