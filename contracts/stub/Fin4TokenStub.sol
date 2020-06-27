pragma solidity ^0.5.17;

contract Fin4TokenStub {

    function name() public view returns(string memory);

    function getTokenCreator() public view returns(address);

    function receiveVerifierApprovalNotice(address verifierTypeAddress, uint claimId, string memory message) public;

    function receiveVerifierRejectionNotice(address verifierTypeAddress, uint claimId, string memory message) public;

    function receiveVerifierPendingNotice(address verifierTypeAddress, uint claimId) public;

    function countApprovedClaimsOfThisUser(address user) public returns(uint);

    function balanceOf(address account) public view returns (uint256);

}
