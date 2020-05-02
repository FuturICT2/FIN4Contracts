pragma solidity ^0.5.17;

contract Fin4SystemParameters {

    uint public REPforTokenCreation = 300;
    uint public REPforTokenClaim = 50;

    function getSystemParameters() public view returns(uint, uint) {
        return (REPforTokenCreation, REPforTokenClaim);
    }

}
