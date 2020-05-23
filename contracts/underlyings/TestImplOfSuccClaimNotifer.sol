pragma solidity ^0.5.17;

import 'contracts/underlyings/SuccessfulClaimNotifierInterface.sol';

contract TestImplOfSuccClaimNotifer is SuccessfulClaimNotifierInterface {

    string public dev = "nothing happened";

    function successfulClaimNotify(address tokenAddress, address claimer, uint claimedQuantity) public {
        dev = "that worked!";
    }

}
