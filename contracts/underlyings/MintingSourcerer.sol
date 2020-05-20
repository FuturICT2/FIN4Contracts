pragma solidity ^0.5.17;

import 'contracts/underlyings/BaseSourcerer.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract MintingSourcerer is BaseSourcerer {

    function exchange(address pat, address collateral, uint amount) public {
        bytes32 id = getId(pat, collateral);

        // ERC20(collateral).mint(beneficiary, amount);
    }

    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address:collateral:address of token to mint,address:beneficiary:leave blank for it to be the claimer,"
            "uint:exchangeRatio:give n get n*x collateral minted";
    }

}
