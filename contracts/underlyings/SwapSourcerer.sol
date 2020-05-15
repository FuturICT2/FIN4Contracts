pragma solidity ^0.5.17;

import 'contracts/underlyings/UnderlyingParameterizedInterface.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SwapSourcerer is UnderlyingParameterizedInterface {

    struct SwapPair {
        bool exists;
        bytes32 id;
        address creator;
        address pat;
        address collateral;
        uint exchangeRatio;
        uint totalCollateralBalance;
        mapping(address => uint) contributions;
        address[] contributors;
    }

    mapping(bytes32 => SwapPair) public pairs;
    bytes32[] public ids;

    function getId(address pat, address collateral) public view returns(bytes32) {
        return keccak256(abi.encodePacked(pat, collateral));
    }

    function setParameters(address pat, address collateral, uint exchangeRatio) public {
        bytes32 id = getId(pat, collateral);
        require(!pairs[id].exists, "Swap pair already exists");

        SwapPair storage swapPair = pairs[id];
        swapPair.exists = true; // to query the mapping without having an extra mapping(bytes32 => true) public existingPairIds;
        swapPair.id = id;
        swapPair.creator = msg.sender;
        swapPair.pat = pat;
        swapPair.collateral = collateral;
        swapPair.exchangeRatio = exchangeRatio;

        ids.push(id);
    }

    function depositCollateral(address intendedForPat, address collateral, uint amount) public {
        require(amount > 0, "Amount must be > 0");
        bytes32 id = getId(intendedForPat, collateral);
        require(pairs[id].exists, "Swap pair does not exist");

        // collect approved COLLATERAL, requires the amount to be approved by the user on the collateral token beforend (allowances)
        ERC20(collateral).transferFrom(msg.sender, address(this), amount);

        pairs[id].totalCollateralBalance += amount;
        if (pairs[id].contributions[msg.sender] == 0) { // 0 is default value
            pairs[id].contributors.push(msg.sender);
        }
        pairs[id].contributions[msg.sender] += amount;
    }

    function swap(address pat, address collateral, uint amount) public {
        bytes32 id = getId(pat, collateral);
        require(pairs[id].exists, "Swap pair does not exist");

        // collect approved PAT, requires the amount to be approved by the user on the PAT token beforend (allowances)
        ERC20(pat).transferFrom(msg.sender, address(this), amount);
        // send COLLATERAL --> TODO check balance before
        ERC20(collateral).transfer(msg.sender, amount * pairs[id].exchangeRatio);

        pairs[id].totalCollateralBalance -= amount;
    }

    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address:pat:address of PAT,address:collateral:address of collateral token,"
            "uint:exchangeRatio:give n, get n*x collateral";
    }

    function getCollateralBalanceOnSwapPair(address pat, address collateral) public view returns(uint) {
        bytes32 id = getId(pat, collateral);
        require(pairs[id].exists, "Swap pair does not exist");
        return pairs[id].totalCollateralBalance;
    }

    function getSwapPairs() public view returns(address[] memory, address[] memory, uint[] memory, uint[] memory) {
        address[] memory pats = new address[](ids.length);
        address[] memory collaterals = new address[](ids.length);
        uint[] memory collateralBalances = new uint[](ids.length);
        uint[] memory exchangeRatios = new uint[](ids.length);
        for (uint i = 0; i < ids.length; i ++) {
            pats[i] = pairs[ids[i]].pat;
            collaterals[i] = pairs[ids[i]].collateral;
            collateralBalances[i] = pairs[ids[i]].totalCollateralBalance;
            exchangeRatios[i] = pairs[ids[i]].exchangeRatio;
        }
        return (pats, collaterals, collateralBalances, exchangeRatios);
    }

}
