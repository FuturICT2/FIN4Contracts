pragma solidity ^0.5.17;

contract Fin4Underlyings {

    constructor() public {}

    mapping (uint => Underlying) public underlyings;
    // 2nd mapping with contractAddress as key?

    struct Underlying {
        uint id;
        bytes32 name;
        address contractAddress; // can be external to Fin4, must implement xyz
        // TODO: valid for / editable later on / what else?
    }

    uint public nextUnderlyingId = 0;

    function addUnderlying(bytes32 name, address contractAddress) public {
        Underlying storage underlying = underlyings[nextUnderlyingId];
        underlying.id = nextUnderlyingId;
        underlying.name = name;
        underlying.contractAddress = contractAddress;
        nextUnderlyingId ++;
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

}
