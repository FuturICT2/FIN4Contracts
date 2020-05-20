pragma solidity ^0.5.17;

import 'contracts/underlyings/UnderlyingParameterizedInterface.sol';

contract BaseSourcerer is UnderlyingParameterizedInterface { // abstract class

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

    function setParameters(address pat, address collateral, address beneficiary, uint exchangeRatio) public {
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

    // omit pat address because frontend passes it as first argument always with setParameters()
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory);

    function exchange(address pat, address collateral, uint amount) public;

    function getCollateralBalanceOnPair(address pat, address collateral) public view returns(uint) {
        bytes32 id = getId(pat, collateral);
        return pairs[id].totalCollateralBalance;
    }

    function getPairs() public view returns(address[] memory, address[] memory, uint[] memory) {
        address[] memory pats = new address[](ids.length);
        address[] memory collaterals = new address[](ids.length);
        uint[] memory exchangeRatios = new uint[](ids.length);
        for (uint i = 0; i < ids.length; i ++) {
            pats[i] = pairs[ids[i]].pat;
            collaterals[i] = pairs[ids[i]].collateral;
            exchangeRatios[i] = pairs[ids[i]].exchangeRatio;
        }
        return (pats, collaterals, exchangeRatios);
    }

}
