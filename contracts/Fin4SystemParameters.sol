pragma solidity ^0.5.0;

contract Fin4SystemParameters {

    uint public REPforTokenCreation = 50;
    uint public REPforTokenClaim = 20;

    function getSystemParameters() public view returns(uint, uint) {
        return (REPforTokenCreation, REPforTokenClaim);
    }

}
