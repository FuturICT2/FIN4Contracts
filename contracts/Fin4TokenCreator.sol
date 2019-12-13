pragma solidity ^0.5.0;

import 'contracts/Fin4Token.sol';
import 'contracts/Fin4TokenManagement.sol';

contract Fin4TokenCreator {

    address public Fin4ClaimingAddress;
    address public Fin4TokenManagementAddress;
    address public Fin4ProvingAddress;

    constructor(address Fin4ClaimingAddr, address Fin4TokenManagementAddr, address Fin4ProvingAddr) public {
        Fin4ClaimingAddress = Fin4ClaimingAddr;
        Fin4TokenManagementAddress = Fin4TokenManagementAddr;
        Fin4ProvingAddress = Fin4ProvingAddr;
    }

    function postCreationSteps(Fin4TokenBase token, string memory description, string memory actionsText,
        uint[] memory values, address[] memory requiredProofTypes) public {

        require((values[2] == 0 && values[3] != 0) || (values[2] != 0 && values[3] == 0),
            "Exactly one of fixedQuantity and userDefinedQuantityFactor must be nonzero");

        token.addMinter(Fin4ClaimingAddress);
        token.renounceMinter(); // Fin4TokenCreator should not have the MinterRole on tokens

        token.init(Fin4ClaimingAddress, Fin4ProvingAddress, description, actionsText, values[2], values[3]);

        for (uint i = 0; i < requiredProofTypes.length; i++) {
            token.addRequiredProofType(requiredProofTypes[i]);
        }

        Fin4TokenManagement(Fin4TokenManagementAddress).registerNewToken(address(token));
    }
}

contract Fin4UncappedTokenCreator is Fin4TokenCreator {

    constructor(address Fin4ClaimingAddr, address Fin4TokenManagementAddr, address Fin4ProvingAddr)
    Fin4TokenCreator(Fin4ClaimingAddr, Fin4TokenManagementAddr, Fin4ProvingAddr)
    public {}

    function createNewToken(string memory name, string memory symbol, string memory description, string memory actionsText,
        bool[] memory properties, uint[] memory values, address[] memory requiredProofTypes) public returns(address) {

        Fin4TokenBase token = new Fin4Token(name, symbol, msg.sender,
            properties[0], properties[1], properties[2], uint8(values[0]), values[1]);

        postCreationSteps(token, description, actionsText, values, requiredProofTypes);

        return address(token);
    }
}

contract Fin4CappedTokenCreator is Fin4TokenCreator {

    constructor(address Fin4ClaimingAddr, address Fin4TokenManagementAddr, address Fin4ProvingAddr)
    Fin4TokenCreator(Fin4ClaimingAddr, Fin4TokenManagementAddr, Fin4ProvingAddr)
    public {}

    function createNewCappedToken(string memory name, string memory symbol, string memory description, string memory actionsText,
        bool[] memory properties, uint[] memory values, address[] memory requiredProofTypes) public returns(address) {

        Fin4TokenBase token = new Fin4TokenCapped(name, symbol, msg.sender,
            properties[0], properties[1], properties[2], uint8(values[0]), values[1], values[4]);

        postCreationSteps(token, description, actionsText, values, requiredProofTypes);

        return address(token);
    }
}
