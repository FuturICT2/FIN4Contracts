pragma solidity ^0.5.17;

import 'contracts/underlyings/UnderlyingInterface.sol';
import 'contracts/underlyings/UnderlyingParameterizedInterface.sol';
import 'contracts/stub/MintingStub.sol';

contract MintingUnderlying is UnderlyingInterface, UnderlyingParameterizedInterface {

    function successfulClaimCallback(address hostTokenForUnderlying, address claimer, uint quantity) public {
        // msg.sender must be Fin4Underlying, plus other security checks?
        ParameterSet storage parameterSet = tokenToParameterSet[hostTokenForUnderlying];

        address beneficiary;
        if (parameterSet.beneficiary == address(0)) {
            beneficiary = claimer;
        } else {
            beneficiary = parameterSet.beneficiary;
        }

        uint amount;
        if (parameterSet.fixedAmount == 0) {
            amount = quantity * parameterSet.quantityFactor;
        } else {
            amount = parameterSet.fixedAmount;
        }

        MintingStub(parameterSet.tokenToMint).mint(beneficiary, amount);
    }

    // if beneficiary is the zero address, mint to the claimer
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address:tokenToMint:address of token to mint,address:beneficiary:leave blank for it to be the claimer,"
            "uint:fixedAmount:per successful claim:int,uint:quantityFactor:multiply claimed quantity";
    }

    struct ParameterSet {
        address tokenCreator;
        address hostTokenForUnderlying;
        address tokenToMint;
        address beneficiary;
        uint fixedAmount;
        uint quantityFactor;
    }

    mapping (address => ParameterSet) public tokenToParameterSet;

    function setParameters(address hostTokenForUnderlying, address tokenToMint, address beneficiary,
        uint fixedAmount, uint quantityFactor) public {
        ParameterSet storage parameterSet = tokenToParameterSet[hostTokenForUnderlying];
        parameterSet.tokenCreator = msg.sender;
        parameterSet.hostTokenForUnderlying = hostTokenForUnderlying;
        parameterSet.tokenToMint = tokenToMint;
        parameterSet.beneficiary = beneficiary;
        parameterSet.fixedAmount = fixedAmount;
        parameterSet.quantityFactor = quantityFactor;
    }

}
