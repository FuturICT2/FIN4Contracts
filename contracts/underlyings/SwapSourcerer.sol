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

        let exchangeAmount = amount * pairs[id].exchangeRatio;

        // send COLLATERAL --> TODO check balance before
        ERC20(collateral).transfer(getBeneficiary(id, msg.sender), exchangeAmount);

        pairs[id].totalExchangedPatAmount += amount;
        pairs[id].totalCollateralBalance -= exchangeAmount;
    }

    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address:collateral:address of collateral token,address:beneficiary:leave blank for it to be the claimer,"
            "uint:exchangeRatio:give n get n*x collateral";
    }

}
