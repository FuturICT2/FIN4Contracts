pragma solidity ^0.5.17;

import 'contracts/underlyings/UnderlyingInterface.sol';

contract MintingUnderlying is UnderlyingInterface {

    function successfulClaimCallback(address tokenAddress, address claimer, uint quantity) public {
        // TODO
    }

}
