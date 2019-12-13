pragma solidity ^0.5.0;

import 'contracts/Fin4Token.sol';

contract Fin4TokenCreator {

    address public Fin4ClaimingAddress;
    constructor(address Fin4ClaimingAddr) public {
        Fin4ClaimingAddress = Fin4ClaimingAddr;
    }

    function postCreationSteps(Fin4TokenBase token) public {
        token.addMinter(Fin4ClaimingAddress);
        token.renounceMinter(); // Fin4TokenCreator should not have the MinterRole on tokens
    }
}

contract Fin4UncappedTokenCreator is Fin4TokenCreator {

    constructor(address Fin4ClaimingAddr)
    Fin4TokenCreator(Fin4ClaimingAddr)
    public {}

    function createNewToken(string memory name, string memory _symbol, bool isBurnable, bool isTransferable,
        bool isMintable, uint8 decimals, uint initialSupply) public returns(address) {

        Fin4TokenBase token = new Fin4Token(name, _symbol, msg.sender,
            isBurnable, isTransferable, isMintable, decimals, initialSupply);

        postCreationSteps(token);

        return address(token);
    }
}

contract Fin4CappedTokenCreator is Fin4TokenCreator {

    constructor(address Fin4ClaimingAddr)
    Fin4TokenCreator(Fin4ClaimingAddr)
    public {}

    function createNewCappedToken(string memory name, string memory _symbol, bool isBurnable, bool isTransferable,
        bool isMintable, uint8 decimals, uint initialSupply, uint cap) public returns(address) {

        Fin4TokenBase token = new Fin4TokenCapped(name, _symbol, msg.sender,
            isBurnable, isTransferable, isMintable, decimals, initialSupply, cap);

        postCreationSteps(token);

        return address(token);
    }
}
