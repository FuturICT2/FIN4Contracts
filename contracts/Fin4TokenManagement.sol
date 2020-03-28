pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2; --> allows string[] memory

import 'contracts/Fin4Token.sol';
import 'contracts/stub/MintingStub.sol';
import 'contracts/Fin4SystemParameters.sol';

contract Fin4TokenManagement {

    // TODO do we need the indexed keyword for event params?
    event Fin4TokenCreated(address addr, string name, string symbol, string description, string unit, address creator,
        uint creationTime, bool hasFixedMintingQuantity);

    address public creator;
    address public Fin4SystemParametersAddress;
    address public Fin4ReputationAddress;

    constructor(address Fin4SystemParametersAddr) public {
        creator = msg.sender;
        Fin4SystemParametersAddress = Fin4SystemParametersAddr;
    }

    function setFin4ReputationAddress(address Fin4ReputationAddr) public {
        require(msg.sender == creator, "Only the creator of this smart contract can call this function");
        // TODO furthermore it should be only callable once? #ConceptualDecision #NoBackdoors
        Fin4ReputationAddress = Fin4ReputationAddr;
    }

    address[] public allFin4Tokens;

    function registerNewToken(address tokenAddress) public {
        Fin4TokenBase token = Fin4TokenBase(tokenAddress);

        // REP reward for creating a new token
        MintingStub(Fin4ReputationAddress).mint(token.tokenCreator(), Fin4SystemParameters(Fin4SystemParametersAddress).REPforTokenCreation());

        allFin4Tokens.push(tokenAddress);

        // or cheaper/better to get these values via one getter?
        emit Fin4TokenCreated(tokenAddress, token.name(), token.symbol(), token.description(), token.unit(),
            token.tokenCreator(), token.tokenCreationTime(), token.fixedAmount() != 0);
    }

    function getAllFin4Tokens() public view returns(address[] memory) {
        return allFin4Tokens;
    }

    // relay-functions to not have to call Fin4Token contracts directly from the frontend

    function getTokenInfo(address tokenAddr) public view returns(bool, string memory, string memory,
        string memory, string memory, uint256, uint, bool) {
        return Fin4Token(tokenAddr).getTokenInfo(msg.sender);
    }

    // ------------------------- BALANCE -------------------------

    function getBalance(address user, address tokenAddress) public view returns(uint256) {
        return Fin4Token(tokenAddress).balanceOf(user);
    }

    function getMyNonzeroTokenBalances() public view returns(address[] memory, uint256[] memory) {
        uint count = 0;
        for (uint i = 0; i < allFin4Tokens.length; i ++) {
            if (getBalance(msg.sender, allFin4Tokens[i]) > 0) {
                count ++;
            }
        }
        // combine this with actionsWhereUserHasClaims to toss the upper loop?
        address[] memory nonzeroBalanceTokens = new address[](count);
        uint256[] memory balances = new uint256[](count);
        count = 0;
        for (uint i = 0; i < allFin4Tokens.length; i ++) {
            uint256 balance = getBalance(msg.sender, allFin4Tokens[i]);
            if (balance > 0) {
                nonzeroBalanceTokens[count] = allFin4Tokens[i];
                balances[count] = balance;
                count += 1;
            }
        }
        return (nonzeroBalanceTokens, balances);
    }
}
