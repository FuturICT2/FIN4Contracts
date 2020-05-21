pragma solidity ^0.5.17;

import 'contracts/Fin4TokenBase.sol';
import 'contracts/underlyings/BaseSourcerer.sol';

contract Fin4Underlyings {

    constructor() public {}

    mapping (uint => Underlying) public underlyings; // 2nd mapping with contractAddress as key?
    address[] public sourcererAddresses;

    struct Underlying {
        uint id;
        bytes32 name;
        address contractAddress; // can be external to Fin4, must implement xyz
        // TODO: valid for / editable later on / what else?
        // TODO a visibility boolean to optionally hide it in frontend?
    }

    uint public nextUnderlyingId = 0;

    function addUnderlying(bytes32 name, address contractAddress) public {
        Underlying storage underlying = underlyings[nextUnderlyingId];
        underlying.id = nextUnderlyingId;
        underlying.name = name;
        underlying.contractAddress = contractAddress;
        nextUnderlyingId ++;
    }

    function addSourcerer(bytes32 name, address contractAddress) public {
        sourcererAddresses.push(contractAddress);
        addUnderlying(name, contractAddress);
    }

    function getUnderlyings() public view returns(uint[] memory, bytes32[] memory, address[] memory) {
        uint[] memory ids = new uint[](nextUnderlyingId);
        bytes32[] memory names = new bytes32[](nextUnderlyingId);
        address[] memory contractAddresses = new address[](nextUnderlyingId);
        for (uint i = 0; i < nextUnderlyingId; i ++) {
            ids[i] = underlyings[i].id;
            names[i] = underlyings[i].name;
            contractAddresses[i] = underlyings[i].contractAddress;
        }
        return (ids, names, contractAddresses);
    }

    function getParamsEncodedOnUnderlyingContract(address contractAddress) public view returns(string memory) {
        return BaseSourcerer(contractAddress).getParameterForTokenCreatorToSetEncoded();
    }

    // are there cheaper / more effective ways to implement this method? Seems bloated
    function getAllSourcererPairs() public view returns(address[] memory, address[] memory, address[] memory,
        uint[] memory, uint[] memory, uint[] memory) {
        uint totalPairsCount = 0;
        uint[] memory pairsCountPerSourcerer = new uint[](sourcererAddresses.length);
        for (uint i = 0; i < sourcererAddresses.length; i ++) {
            uint pairsCount = BaseSourcerer(sourcererAddresses[i]).getPairsCount();
            totalPairsCount += pairsCount;
            pairsCountPerSourcerer[i] = pairsCount;
        }
        address[] memory pat_arr = new address[](totalPairsCount);
        address[] memory collateral_arr = new address[](totalPairsCount);
        address[] memory beneficiary_arr = new address[](totalPairsCount);
        uint[] memory exchangeRatio_arr = new uint[](totalPairsCount);
        uint[] memory totalCollBalance_arr = new uint[](totalPairsCount);
        uint[] memory totalExPatAmount_arr = new uint[](totalPairsCount);
        address pat;
        address collateral;
        address beneficiary;
        uint exchangeRatio;
        uint totalCollBalance;
        uint totalExPatAmount;
        uint count = 0;
        for (uint i = 0; i < sourcererAddresses.length; i ++) {
            for (uint j = 0; j < pairsCountPerSourcerer[i]; j ++) {
                bytes32 id = BaseSourcerer(sourcererAddresses[i]).ids(j);
                (pat, collateral, beneficiary, exchangeRatio,
                    totalCollBalance, totalExPatAmount) = BaseSourcerer(sourcererAddresses[i]).getPair(id);
                pat_arr[count] = pat;
                collateral_arr[count] = collateral;
                beneficiary_arr[count] = beneficiary;
                exchangeRatio_arr[count] = exchangeRatio;
                totalCollBalance_arr[count] = totalCollBalance;
                totalExPatAmount_arr[count] = totalExPatAmount;
                count ++;
            }
        }
        return (pat_arr, collateral_arr, beneficiary_arr, exchangeRatio_arr, totalCollBalance_arr, totalExPatAmount_arr);
    }

}
