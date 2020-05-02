pragma solidity ^0.5.17;

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
        bool adminGroupIsSet;
        address[] tokens;
        mapping (address => bool) tokensSet;
        string name;
        string identifier;
        string description;
        string color; // not used yet
        string logoURL; // not used yet
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
        col.adminGroupIsSet = false;
        identifiers[identifier] = true;
        nextCollectionId ++;
        return nextCollectionId - 1;
    }

    function getCollection(uint collectionId) public view returns(bool, bool, bool, uint, address[] memory,
        string memory, string memory, string memory) {
        Collection memory col = collections[collectionId];

        return(col.creator == msg.sender, _userIsAdmin(collectionId, msg.sender), col.adminGroupIsSet, col.adminGroupId,
            col.tokens, col.name, col.identifier, col.description);
    }

    modifier userIsCreator(uint collectionId) {
        require(collections[collectionId].creator == msg.sender, "User is not collection creator");
        _;
    }

    modifier userIsAdmin(uint collectionId) {
        require(_userIsAdmin(collectionId, msg.sender), "User is not creator or in the appointed admin group");
        _;
    }

    function _userIsAdmin(uint collectionId, address user) public view returns(bool) {
        if (collections[collectionId].creator == user) {
            return true;
        }
        if (collections[collectionId].adminGroupIsSet) {
            return Fin4Groups(Fin4GroupsAddress).isMember(collections[collectionId].adminGroupId, user);
        }
        return false;
    }

    function transferOwnership(uint collectionId, address newOwner) public userIsCreator(collectionId) {
        collections[collectionId].creator = newOwner;
    }

    function setAdminGroupId(uint collectionId, uint groupId) public userIsCreator(collectionId) {
        require(Fin4Groups(Fin4GroupsAddress).groupExists(groupId), "Group does not exist");
        collections[collectionId].adminGroupId = groupId;
        collections[collectionId].adminGroupIsSet = true;
    }

    function removeAdminGroup(uint collectionId) public userIsCreator(collectionId) {
        collections[collectionId].adminGroupIsSet = false;
    }

    function addTokens(uint collectionId, address[] memory newTokens) public userIsAdmin(collectionId) {
        Collection storage col = collections[collectionId];
        for (uint i = 0; i < newTokens.length; i ++) {
            if (!col.tokensSet[newTokens[i]]) {
                col.tokens.push(newTokens[i]);
                col.tokensSet[newTokens[i]] = true;
            }
        }
    }

    function removeToken(uint collectionId, address tokenToRemove) public userIsAdmin(collectionId) {
        Collection storage col = collections[collectionId];

        require(col.tokensSet[tokenToRemove], "Token not contained in this collection, can't remove it");

        uint tokenIndex = getIndexOfToken(collectionId, tokenToRemove);
        uint length = col.tokens.length;
        col.tokens[tokenIndex] = col.tokens[length - 1];
        delete col.tokens[length - 1];
        col.tokens.length --;

        col.tokensSet[tokenToRemove] = false;
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
