pragma solidity ^0.5.17;

import 'contracts/underlyings/BaseSourcerer.sol';

contract BurnSourcerer is BaseSourcerer {

    function convert(address pat, address collateral, uint amount) public {
        bytes32 id = getId(pat, collateral);
        fetchAndBurnPAT(pat, msg.sender, amount);
        uint exchangeAmount = amount * pairs[id].exchangeRatio;

        // burn COLLATERAL, requires there to be at least that amount to be burned
        ERC20Burnable(collateral).burn(exchangeAmount);

        pairs[id].totalExchangedPatAmount += amount;
        pairs[id].totalCollateralBalance -= exchangeAmount;
    }

    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address:collateral:address of token to burn,uint:exchangeRatio:give n to burn n*x collateral";
    }

}
