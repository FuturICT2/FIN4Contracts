pragma solidity ^0.5.17;

import 'contracts/underlyings/UnderlyingInterface.sol';

contract MintingUnderlying is UnderlyingInterface {

    function successfulClaimCallback(address tokenAddress, address claimer, uint quantity) public {
        // TODO
    }

    // if beneficiary is the zero address, mint to the claimer
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address:tokenToMint:address of token to mint,address:beneficiary:leave blank for it to be the claimer,"
            "uint:fixedAmount:per successful claim:int,uint:quantityFactor:claimed quantity gets multiplied by this";
    }

}
