pragma solidity ^0.5.17;

import 'contracts/underlyings/BaseSourcerer.sol';

contract SwapSourcerer is BaseSourcerer {

    function convert(address pat, address collateral, uint amount) public {
        bytes32 id = getId(pat, collateral);
        fetchAndBurnPAT(pat, msg.sender, amount);

        uint exchangeAmount = amount * pairs[id].exchangeRatio;
        require(pairs[id].totalCollateralBalance >= exchangeAmount, "Not enough collateral balance on this pair to swap");

        ERC20(collateral).transfer(getBeneficiary(id, msg.sender), exchangeAmount);

        pairs[id].totalExchangedPatAmount += amount;
        pairs[id].totalCollateralBalance -= exchangeAmount;
    }

    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address:collateral:address of collateral token,address:beneficiary:leave blank for it to be the claimer,"
            "uint:exchangeRatio:give n get n*x collateral";
    }

}
