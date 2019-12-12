pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2; --> allows string[] memory

import 'contracts/Fin4Token.sol';
import 'contracts/stub/MintingStub.sol';
import 'contracts/Fin4SystemParameters.sol';
import "solidity-util/lib/Strings.sol";

contract Fin4TokenManagement {
    using Strings for string;

    // TODO do we need the indexed keyword for event params?
    event Fin4TokenCreated(address addr, string name, string symbol, string description, string unit, address creator,
        uint creationTime, bool hasFixedMintingQuantity);

    address public creator;
    address public Fin4ClaimingAddress;
    address public Fin4ProvingAddress;
    address public Fin4SystemParametersAddress;
    address public Fin4ReputationAddress;

    constructor(address Fin4ClaimingAddr, address Fin4ProvingAddr, address Fin4SystemParametersAddr) public {
        creator = msg.sender;
        Fin4ClaimingAddress = Fin4ClaimingAddr;
        Fin4ProvingAddress = Fin4ProvingAddr;
        Fin4SystemParametersAddress = Fin4SystemParametersAddr;
    }

    function setFin4ReputationAddress(address Fin4ReputationAddr) public {
        require(msg.sender == creator, "Only the creator of this smart contract can call this function");
        // TODO furthermore it should be only callable once? #ConceptualDecision #NoBackdoors
        Fin4ReputationAddress = Fin4ReputationAddr;
    }

    address[] public allFin4Tokens;

    function initNewToken(address tokenAddress, string memory description, string memory actionsText,
        uint fixedQuantity, uint userDefinedQuantityFactor, address[] memory requiredProofTypes) public {
        /*
            This check seems super costly as it brings this contract to out of gas errors during deployment quickly
            Commenting it out until a better (cheaper) solution is found
        // mapping (string => bool) public symbolIsUsed;
        uint symLen = symbol.length();
        require(symLen >= 3 && symLen <= 5, "Symbol must have between 3 and 5 characters");
        string memory _symbol = symbol.upper();
        require(!symbolIsUsed[_symbol], "Symbol is already in use");
        symbolIsUsed[_symbol] = true;
        */

        require(
            (fixedQuantity == 0 && userDefinedQuantityFactor != 0) ||
            (fixedQuantity != 0 && userDefinedQuantityFactor == 0),
            "Exactly one of fixedQuantity and userDefinedQuantityFactor must be nonzero");

        Fin4TokenBase token = Fin4TokenBase(tokenAddress);

        token.init(Fin4ClaimingAddress, Fin4ProvingAddress, description, actionsText, fixedQuantity, userDefinedQuantityFactor);

        for (uint i = 0; i < requiredProofTypes.length; i++) {
            token.addRequiredProofType(requiredProofTypes[i]);
        }

        // REP reward for creating a new token
        MintingStub(Fin4ReputationAddress).mint(msg.sender, Fin4SystemParameters(Fin4SystemParametersAddress).REPforTokenCreation());

        allFin4Tokens.push(tokenAddress);
        emit Fin4TokenCreated(tokenAddress, token.name(), token.symbol(), description, "",
            msg.sender, token.tokenCreationTime(), fixedQuantity != 0);
    }

    function getAllFin4Tokens() public view returns(address[] memory) {
        return allFin4Tokens;
    }

    // relay-functions to not have to call Fin4Token contracts directly from the frontend

    function getTokenInfo(address tokenAddr) public view returns(bool, bool, string memory, string memory,
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
