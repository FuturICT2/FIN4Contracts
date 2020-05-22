pragma solidity ^0.5.17;

import 'contracts/underlyings/SuccessfulClaimNotifierInterface.sol';

contract TestImplOfSuccClaimNotifer is SuccessfulClaimNotifierInterface {

    uint public dev = 1;

    function successfulClaimNotify(address tokenAddress, address claimer, uint claimedQuantity) public {
        dev = 2;
    }

}
