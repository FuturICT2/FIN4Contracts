pragma solidity ^0.5.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "contracts/stub/Fin4UnderlyingsStub.sol";

contract BaseSourcerer { // abstract class

    address Fin4UnderlyingsAddress;

    constructor(address Fin4UnderlyingsAddr) public {
        Fin4UnderlyingsAddress = Fin4UnderlyingsAddr;
    }

    struct Pair {
        bool exists;
        bytes32 id;
        address creator;
        address pat;
        address collateral;
        address beneficiary;
        uint exchangeRatio;
        uint totalCollateralBalance;
        uint totalExchangedPatAmount;
        // mapping(address => uint) contributions;
        // address[] contributors;
    }

    mapping(bytes32 => Pair) public pairs;
    bytes32[] public ids;

    function _getId(address pat, address collateral) private view returns(bytes32) {
        return keccak256(abi.encodePacked(pat, collateral));
    }

    function getId(address pat, address collateral) public view returns(bytes32) {
        bytes32 id = _getId(pat, collateral);
        require(pairs[id].exists, "Pair does not exist");
        return id;
    }

    function getBeneficiary(bytes32 id, address msgSender) internal view returns(address) {
        if (pairs[id].beneficiary == address(0)) {
            return msgSender;
        }
        return pairs[id].beneficiary;
    }

    function setParameters(address pat, address collateral, address beneficiary, uint exchangeRatio) public {
        require(Fin4UnderlyingsStub(Fin4UnderlyingsAddress).newSourcererPairAllowedWithPat(pat), "New pairs with this PAT are not allowed");
        require(Fin4UnderlyingsStub(Fin4UnderlyingsAddress).newSourcererPairAllowedWithCollateral(pat, collateral),
            "This collateral can't be used in this pair");
        bytes32 id = _getId(pat, collateral);
        require(!pairs[id].exists, "Pair already exists");

        Pair storage pair = pairs[id];
        pair.exists = true; // to query the mapping without having an extra mapping(bytes32 => true) public existingPairIds;
        pair.id = id;
        pair.creator = msg.sender;
        pair.pat = pat;
        pair.collateral = collateral;
        pair.beneficiary = beneficiary;
        pair.exchangeRatio = exchangeRatio;

        ids.push(id);
    }

    // TODO token creator should be able to limit who can deposit and maybe up to which amount(s) etc.?
    function depositCollateral(address pat, address collateral, uint amount) public {
        require(amount > 0, "Amount must be > 0");
        bytes32 id = getId(pat, collateral);

        // collect approved COLLATERAL, requires the amount to be approved by the user on the collateral token beforend (allowances)
        ERC20(collateral).transferFrom(msg.sender, address(this), amount);

        pairs[id].totalCollateralBalance += amount;
        // if (pairs[id].contributions[msg.sender] == 0) { // 0 is default value
        //     pairs[id].contributors.push(msg.sender);
        // }
        // pairs[id].contributions[msg.sender] += amount;
    }

    function convert(address pat, address collateral, uint amount) public;

    function fetchAndBurnPAT(address pat, address sender, uint amount) internal {
        // collect approved PAT, requires the amount to be approved by the user on the PAT token beforend (allowances)
        ERC20(pat).transferFrom(sender, address(this), amount);
        // burn that PAT amount
        ERC20Burnable(pat).burn(amount);
    }

    function getCollateralBalanceOnPair(address pat, address collateral) public view returns(uint) {
        bytes32 id = getId(pat, collateral);
        return pairs[id].totalCollateralBalance;
    }

    // are there cheaper / more effective ways to implement this method? Seems bloated
    function getPairs() public view returns(address[] memory, address[] memory, address[] memory,
        uint[] memory, uint[] memory, uint[] memory) {
        address[] memory pats = new address[](ids.length);
        address[] memory collaterals = new address[](ids.length);
        address[] memory beneficiaries = new address[](ids.length);
        uint[] memory exchangeRatios = new uint[](ids.length);
        uint[] memory totalCollateralBalances = new uint[](ids.length);
        uint[] memory totalExchangedPatAmounts = new uint[](ids.length);
        for (uint i = 0; i < ids.length; i ++) {
            bytes32 id = ids[i];
            pats[i] = pairs[id].pat;
            collaterals[i] = pairs[id].collateral;
            beneficiaries[i] = pairs[id].beneficiary;
            exchangeRatios[i] = pairs[id].exchangeRatio;
            totalCollateralBalances[i] = pairs[id].totalCollateralBalance;
            totalExchangedPatAmounts[i] = pairs[id].totalExchangedPatAmount;
        }
        return (pats, collaterals, beneficiaries, exchangeRatios, totalCollateralBalances, totalExchangedPatAmounts);
    }

    // TO OVERWRITE BY EXTENDING CLASSES

    // format: "type:name:description,type:name:description"
    // will be displayed as "name (description)" in the respective frontend input fields
    // omit PAT address because frontend passes it as first argument always with setParameters()
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory);

    // extending classes must also have this function:
    // function setParameters() public;
    // the arguments vary though based on what is encoded in getParameterForTokenCreatorToSetEncoded()

}
