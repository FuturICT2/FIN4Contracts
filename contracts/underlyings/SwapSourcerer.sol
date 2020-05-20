pragma solidity ^0.5.17;

import 'contracts/underlyings/BaseSourcerer.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SwapSourcerer is BaseSourcerer {

    function depositCollateral(address intendedForPat, address collateral, uint amount) public {
        require(amount > 0, "Amount must be > 0");
        bytes32 id = getId(intendedForPat, collateral);

        // collect approved COLLATERAL, requires the amount to be approved by the user on the collateral token beforend (allowances)
        ERC20(collateral).transferFrom(msg.sender, address(this), amount);

        pairs[id].totalCollateralBalance += amount;
        // if (pairs[id].contributions[msg.sender] == 0) { // 0 is default value
        //     pairs[id].contributors.push(msg.sender);
        // }
        // pairs[id].contributions[msg.sender] += amount;
    }

    function exchange(address pat, address collateral, uint amount) public {
        bytes32 id = getId(pat, collateral);

        // collect approved PAT, requires the amount to be approved by the user on the PAT token beforend (allowances)
        ERC20(pat).transferFrom(msg.sender, address(this), amount);
        // send COLLATERAL --> TODO check balance before
        ERC20(collateral).transfer(msg.sender, amount * pairs[id].exchangeRatio);

        pairs[id].totalExchangedPatAmount += amount;
        pairs[id].totalCollateralBalance -= amount;
    }

    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        // omit pat address because frontend passes it as first argument always with setParameters()
        return "address:collateral:address of collateral token,uint:exchangeRatio:give n get n*x collateral";
    }

}
