pragma solidity ^0.5.0;

import 'contracts/Fin4Token.sol';

contract Fin4TokenCreator {

    address public Fin4ClaimingAddress;
    constructor(address Fin4ClaimingAddr) public {
        Fin4ClaimingAddress = Fin4ClaimingAddr;
    }

    function createNewToken(string memory name, string memory _symbol, bool isBurnable, bool isTransferable,
    bool isMintable, uint8 decimals, uint initialSupply) public returns(address) {

        Fin4TokenBase newToken = new Fin4Token(name, _symbol, msg.sender,
            isBurnable, isTransferable, isMintable, decimals, initialSupply);

        newToken.addMinter(Fin4ClaimingAddress);
        newToken.renounceMinter(); // Fin4TokenCreator should not have the MinterRole on tokens

        return address(newToken);
    }
}

contract Fin4CappedTokenCreator {

    address public Fin4ClaimingAddress;
    constructor(address Fin4ClaimingAddr) public {
        Fin4ClaimingAddress = Fin4ClaimingAddr;
    }

    function createNewCappedToken(string memory name, string memory _symbol, bool isBurnable, bool isTransferable,
    bool isMintable, uint8 decimals, uint initialSupply, uint cap) public returns(address) {

        Fin4TokenBase newToken = new Fin4TokenCapped(name, _symbol, msg.sender,
            isBurnable, isTransferable, isMintable, decimals, initialSupply, cap);

        newToken.addMinter(Fin4ClaimingAddress);
        newToken.renounceMinter(); // Fin4CappedTokenCreator should not have the MinterRole on tokens

        return address(newToken);
    }
}
