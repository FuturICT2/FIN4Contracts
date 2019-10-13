pragma solidity ^0.5.0;

contract Fin4Collections {

    address public Fin4MainAddress;

    constructor(address Fin4MainAddr) public {
        Fin4MainAddress = Fin4MainAddr;
    }

    struct Collection {
        uint collectionId;
        address creator;
        address[] tokens;
        address[] admins;
        string name;
        string identifier;
        string description;
        string color;
        string logoURL;
    }

    mapping (uint => Collection) public collections;

}
