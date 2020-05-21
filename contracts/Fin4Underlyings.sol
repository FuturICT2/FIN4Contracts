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
        bool isSourcerer;
        address contractAddress; // can be external to Fin4, must implement xyz
        // TODO: valid for / editable later on / what else?
        // TODO a visibility boolean to optionally hide it in frontend?
    }

    uint public nextUnderlyingId = 0;

    function addUnderlying(bytes32 name, address contractAddress, bool isSourcerer) public {
        Underlying storage underlying = underlyings[nextUnderlyingId];
        underlying.id = nextUnderlyingId;
        underlying.name = name;
        underlying.isSourcerer = isSourcerer;
        underlying.contractAddress = contractAddress;
        nextUnderlyingId ++;
    }

    function addSourcerer(bytes32 name, address contractAddress) public {
        sourcererAddresses.push(contractAddress);
        addUnderlying(name, contractAddress, true);
    }

    function getUnderlyings() public view returns(uint[] memory, bytes32[] memory, bool[] memory, address[] memory) {
        uint[] memory ids = new uint[](nextUnderlyingId);
        bytes32[] memory names = new bytes32[](nextUnderlyingId);
        bool[] memory isSourcerers = new bool[](nextUnderlyingId);
        address[] memory contractAddresses = new address[](nextUnderlyingId);
        for (uint i = 0; i < nextUnderlyingId; i ++) {
            ids[i] = underlyings[i].id;
            names[i] = underlyings[i].name;
            isSourcerers[i] = underlyings[i].isSourcerer;
            contractAddresses[i] = underlyings[i].contractAddress;
        }
        return (ids, names, isSourcerers, contractAddresses);
    }

    function getSourcererParams(address sourcererAddress) public view returns(string memory) {
        return BaseSourcerer(sourcererAddress).getParameterForTokenCreatorToSetEncoded();
    }

    function getSourcererPairs(address sourcererAddress) public view returns(address[] memory,
        address[] memory, address[] memory, uint[] memory, uint[] memory, uint[] memory) {
        return BaseSourcerer(sourcererAddress).getPairs();
    }

}
