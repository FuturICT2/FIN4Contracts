pragma solidity ^0.5.0;

import "solidity-util/lib/Strings.sol";

contract Fin4Collections {
    using Strings for string;

    struct Collection {
        uint collectionId;
        address creator;
        address[] admins;
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
        require(identifier.length() > 2, "Identifier is too short"); // TODO #ConceptualDecision
        require(!identifiers[identifier], "Identifier already in use");
        Collection storage col = collections[nextCollectionId];
        col.creator = msg.sender;
        col.admins.push(msg.sender);
        col.name = name;
        col.identifier = identifier;
        col.description = description;
        nextCollectionId ++;
        identifiers[identifier] = true;
        return nextCollectionId;
    }

    function getCollection(uint collectionId) public view returns(bool, bool, address[] memory,
        string memory, string memory, string memory, string memory, string memory) {
        Collection memory col = collections[collectionId];
        return(col.creator == msg.sender, getIndexOfAdmin(collectionId, msg.sender) != INVALID_INDEX, col.tokens,
            col.name, col.identifier, col.description, col.color, col.logoURL);
    }

    // obsolete?
    function getCollectionTokens(uint collectionId) public view returns(address[] memory) {
        collections[collectionId].tokens;
    }

    function getCollectionAdmins(uint collectionId) public view returns(address[] memory) {
        collections[collectionId].admins;
    }

    function addAdmin(uint collectionId, address newAdmin) public {
        require(collections[collectionId].creator == msg.sender, "Only the collection creator can add admins");
        collections[collectionId].admins.push(newAdmin);
    }

    function removeAdmin(uint collectionId, address adminToRemove) public {
        require(collections[collectionId].creator == msg.sender, "Only the collection creator can remove admins");
        uint index = getIndexOfAdmin(collectionId, adminToRemove);
        require(index != INVALID_INDEX, "Given address is not registered as admin on this collection");
        delete collections[collectionId].admins[index];
    }

    function addTokens(uint collectionId, address[] memory newTokens) public {
        Collection storage col = collections[collectionId];
        uint adminIndex = getIndexOfAdmin(collectionId, msg.sender);
        require(adminIndex != INVALID_INDEX, "Only collection-admins can add tokens");
        for (uint i = 0; i < newTokens.length; i ++) {
            // TODO don't add if its already there
            col.tokens.push(newTokens[i]);
        }
    }

    function removeToken(uint collectionId, address token) public {
        uint adminIndex = getIndexOfAdmin(collectionId, msg.sender);
        require(adminIndex != INVALID_INDEX, "Only collection-admins can remove tokens");
        uint tokenIndex = getIndexOfToken(collectionId, token);
        require(tokenIndex != INVALID_INDEX, "Token not contained in this collection, can't remove it");
        delete collections[collectionId].tokens[tokenIndex];
    }

    // HELPER METHODS

    function getIndexOfAdmin(uint collectionId, address admin) private view returns(uint) {
        Collection memory col = collections[collectionId];
        for (uint i = 0; i < col.admins.length; i ++) {
            if (col.admins[i] == admin) {
                return i;
            }
        }
        return INVALID_INDEX;
    }

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
