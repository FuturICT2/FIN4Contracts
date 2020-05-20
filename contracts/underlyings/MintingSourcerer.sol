pragma solidity ^0.5.17;

import 'contracts/underlyings/BaseSourcerer.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract MintingSourcerer is BaseSourcerer {

    function exchange(address pat, address collateral, uint amount) public {
        bytes32 id = getId(pat, collateral);

        // collect approved PAT, requires the amount to be approved by the user on the PAT token beforend (allowances)
        ERC20(pat).transferFrom(msg.sender, address(this), amount);

        let exchangeAmount = amount * pairs[id].exchangeRatio;

        // mint COLLATERAL, requires this contract to have the minter role
        ERC20(collateral).mint(getBeneficiary(id, msg.sender), exchangeAmount);

        pairs[id].totalExchangedPatAmount += amount;
        pairs[id].totalCollateralBalance += exchangeAmount; // gets up too because of minting
    }

    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address:collateral:address of token to mint,address:beneficiary:leave blank for it to be the claimer,"
            "uint:exchangeRatio:give n get n*x collateral minted";
    }

}
