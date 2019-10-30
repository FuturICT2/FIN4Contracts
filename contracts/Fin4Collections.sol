pragma solidity ^0.5.0;

import "solidity-util/lib/Strings.sol";
import "contracts/Fin4Groups.sol";

contract Fin4Collections {
    using Strings for string;

    address public Fin4GroupsAddress;

    function setFin4GroupsAddress(address Fin4GroupsAddr) public {
        Fin4GroupsAddress = Fin4GroupsAddr;
    }

    struct Collection {
        uint collectionId;
        address creator;
        uint adminGroupId;
        bool adminGroupSet;
        address[] tokens;
        string name;
        string identifier;
        string description;
        string color;
        string logoURL;
    }

    uint public nextCollectionId = 0;
    uint private INVALID_INDEX = 9999;

    mapping (uint => Collection) public collections;
    mapping (string => bool) public identifiers;

    function getCollectionsCount() public view returns(uint) {
        return nextCollectionId;
    }

    function createCollection(string memory name, string memory identifier, string memory description) public returns(uint) {
        // TODO also check for alphanumeric? How?
        require(!identifiers[identifier], "Identifier already in use");
        require(identifier.length() > 2, "Identifier is too short"); // TODO #ConceptualDecision
        Collection storage col = collections[nextCollectionId];
        col.creator = msg.sender;
        col.name = name;
        col.identifier = identifier;
        col.description = description;
        col.adminGroupSet = false;
        identifiers[identifier] = true;
        nextCollectionId ++;
        return nextCollectionId - 1;
    }

    function getCollection(uint collectionId) public view returns(bool, bool, uint, address[] memory,
        string memory, string memory, string memory, string memory, string memory) {
        Collection memory col = collections[collectionId];

        return(col.creator == msg.sender, userIsAdmin(collectionId, msg.sender), col.adminGroupId, col.tokens,
            col.name, col.identifier, col.description, col.color, col.logoURL);
    }

    function userIsAdmin(uint collectionId, address user) private {
        if (collections[collectionId].creator == user) {
            return true;
        }
        if (collections[collectionId].adminGroupSet) {
            return Fin4Groups(Fin4GroupsAddress).isMember(collections[collectionId].adminGroupId, user);
        }
        return false;
    }

    function setAdminGroupId(uint collectionId, uint groupId) public {
        require(collections[collectionId].creator == msg.sender, "Only the collection creator can modify the admin group");
        collections[collectionId].adminGroupId = groupId;
        collections[collectionId].adminGroupSet = true;
    }

    function removeAdminGroup(uint collectionId) public {
        require(collections[collectionId].creator == msg.sender, "Only the collection creator can modify the admin group");
        collections[collectionId].adminGroupSet = false;
    }

    function addTokens(uint collectionId, address[] memory newTokens) public {
        require(userIsAdmin(collectionId, msg.sender), "Only admins can modify the tokens in this collection");
        Collection storage col = collections[collectionId];
        for (uint i = 0; i < newTokens.length; i ++) {
            // TODO don't add if its already there
            col.tokens.push(newTokens[i]);
        }
    }

    function removeToken(uint collectionId, address tokenToRemove) public {
        require(userIsAdmin(collectionId, msg.sender), "Only admins can modify the tokens in this collection");
        uint tokenIndex = getIndexOfToken(collectionId, tokenToRemove);
        require(tokenIndex != INVALID_INDEX, "Token not contained in this collection, can't remove it");

        uint length = collections[collectionId].tokens.length;
        collections[collectionId].tokens[tokenIndex] = collections[collectionId].tokens[length - 1];
        delete collections[collectionId].tokens[length - 1];
        collections[collectionId].tokens.length --;
    }

    // HELPER METHODS

    function getIndexOfToken(uint collectionId, address token) private view returns(uint) {
        Collection memory col = collections[collectionId];
        for (uint i = 0; i < col.tokens.length; i ++) {
            if (col.tokens[i] == token) {
                return i;
            }
        }
        return INVALID_INDEX;
    }

}
