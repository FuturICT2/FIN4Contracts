pragma solidity ^0.5.17;

contract SuccessfulClaimNotifierInterface {

    // implementations of this method should check if Fin4Underlying is msg.sender, otherwise anyone can call this method
    function successfulClaimNotify(address tokenAddress, address claimer, uint claimedQuantity) public;

}
