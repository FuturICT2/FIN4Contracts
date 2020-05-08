pragma solidity ^0.5.17;

import 'contracts/underlyings/UnderlyingInterface.sol';
import 'contracts/underlyings/UnderlyingParameterizedInterface.sol';
import 'contracts/stub/MintTransferStub.sol';

contract TransferUnderlying is UnderlyingInterface, UnderlyingParameterizedInterface {

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

        MintTransferStub(parameterSet.tokenToTransfer).transfer(beneficiary, amount);
    }

    // if beneficiary is the zero address, transfer to the claimer
    // requires this contract to have a balance on this token TODO think about how to check/ensure that, edge cases etc.
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address:tokenToTransfer:address of token to transfer,address:beneficiary:leave blank for it to be the claimer,"
            "uint:fixedAmount:per successful claim:int,uint:quantityFactor:multiply claimed quantity";
    }

    struct ParameterSet {
        address tokenCreator;
        address hostTokenForUnderlying;
        address tokenToTransfer;
        address beneficiary;
        uint fixedAmount;
        uint quantityFactor;
    }

    mapping (address => ParameterSet) public tokenToParameterSet;

    function setParameters(address hostTokenForUnderlying, address tokenToTransfer, address beneficiary,
        uint fixedAmount, uint quantityFactor) public {
        ParameterSet storage parameterSet = tokenToParameterSet[hostTokenForUnderlying];
        parameterSet.tokenCreator = msg.sender;
        parameterSet.hostTokenForUnderlying = hostTokenForUnderlying;
        parameterSet.tokenToTransfer = tokenToTransfer;
        parameterSet.beneficiary = beneficiary;
        parameterSet.fixedAmount = fixedAmount;
        parameterSet.quantityFactor = quantityFactor;
    }

}
