pragma solidity ^0.5.17;

import 'contracts/Fin4Token.sol';
import 'contracts/Fin4TokenManagement.sol';
import "solidity-util/lib/Strings.sol";
import "contracts/Fin4Underlyings.sol";

contract Fin4TokenCreator {

    // This event is only to be able to get the address of the new token into the frontend as return value of send()
    // The "real" new-token event is emitted from Fin4TokenManagement.registerNewToken()
    event NewFin4TokenAddress(address tokenAddress);

    using Strings for string;

    address public Fin4ClaimingAddress;
    address public Fin4TokenManagementAddress;
    address public Fin4UnderlyingsAddress;

    mapping (string => bool) public symbolIsUsed;

    constructor(address Fin4ClaimingAddr, address Fin4TokenManagementAddr, address Fin4UnderlyingsAddr) public {
        Fin4ClaimingAddress = Fin4ClaimingAddr;
        Fin4TokenManagementAddress = Fin4TokenManagementAddr;
        Fin4UnderlyingsAddress = Fin4UnderlyingsAddr;
    }

    // these two methods are propbably super costly

    function nameCheck(string memory name) public returns(string memory) {
        uint len = name.length();
        require(len > 0, "Name can't be empty");
        return name;
    }

    function symbolCheck(string memory symbol) public returns(string memory) {
        uint len = symbol.length();
        require(len >= 3 && len <= 5, "Symbol must have between 3 and 5 characters");
        string memory sym = symbol.upper();
        require(!symbolIsUsed[sym], "Symbol is already in use");
        return sym;
    }

    function postCreationSteps(address tokenAddress, address[] memory requiredVerifierTypes, address[] memory minterRoles,
        string memory description, string memory actionsText, uint fixedAmount, string memory unit, bytes32[] memory underlyingNames) public {

        Fin4TokenBase token = Fin4TokenBase(tokenAddress);
        token.addVerifierTypes(requiredVerifierTypes);

        if (underlyingNames.length > 0 && Fin4UnderlyingsAddress != address(0)) {
            Fin4Underlyings(Fin4UnderlyingsAddress).registerUnderlyingsWithToken(tokenAddress, underlyingNames);
        }

        bool Fin4ClaimingHasMinterRole = false;
        for (uint i = 0; i < minterRoles.length; i++) {
            token.addMinter(minterRoles[i]);
            if (minterRoles[i] == Fin4ClaimingAddress) {
                Fin4ClaimingHasMinterRole = true;
            }
        }
        token.storeAddressesWithMinterRole(minterRoles);
        token.renounceMinter(); // Fin4(Un)cappedTokenCreator should not have the MinterRole on tokens
                                // TODO unless it was given explicitely in this array?

        token.init(Fin4ClaimingAddress, Fin4ClaimingHasMinterRole, description, actionsText, fixedAmount, unit);
        symbolIsUsed[token.symbol()] = true;

        Fin4TokenManagement(Fin4TokenManagementAddress).registerNewToken(address(token));
    }
}

contract Fin4UncappedTokenCreator is Fin4TokenCreator {

    constructor(address Fin4ClaimingAddr, address Fin4TokenManagementAddr, address Fin4UnderlyingsAddr)
    Fin4TokenCreator(Fin4ClaimingAddr, Fin4TokenManagementAddr, Fin4UnderlyingsAddr)
    public {}

    function createNewToken(string memory name, string memory symbol, bool[] memory properties,
        uint[] memory values, address initialSupplyOwner) public {

        Fin4TokenBase token = new Fin4Token(nameCheck(name), symbolCheck(symbol), msg.sender,
            properties[0], properties[1], properties[2], uint8(values[0]), values[1], initialSupplyOwner);

        emit NewFin4TokenAddress(address(token));
    }
}

contract Fin4CappedTokenCreator is Fin4TokenCreator {

    constructor(address Fin4ClaimingAddr, address Fin4TokenManagementAddr, address Fin4UnderlyingsAddr)
    Fin4TokenCreator(Fin4ClaimingAddr, Fin4TokenManagementAddr, Fin4UnderlyingsAddr)
    public {}

    function createNewToken(string memory name, string memory symbol, bool[] memory properties,
        uint[] memory values, address initialSupplyOwner) public {

        Fin4TokenBase token = new Fin4TokenCapped(nameCheck(name), symbolCheck(symbol), msg.sender,
            properties[0], properties[1], properties[2], uint8(values[0]), values[1], values[2], initialSupplyOwner);

        emit NewFin4TokenAddress(address(token));
    }
}
