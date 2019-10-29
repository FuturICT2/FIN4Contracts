pragma solidity ^0.5.0;

contract Fin4Groups {

    struct Group {
        uint groupId;
        address creator;
        address[] members;
        mapping(address => bool) membersSet;
        string name;
    }

    uint public nextGroupId = 0;
    uint private INVALID_INDEX = 9999;

    mapping (uint => Group) public groups;

    function groupExists(uint groupId) public view returns(bool) {
        return groupId < nextGroupId; // in the future, consider group deletion? #ConceptualDecision
    }

    function transferOwnership(uint groupId, address newOwner) public {
        require(msg.sender == groups[groupId].creator, "Only the group creator can transfer ownership");
        groups[groupId].creator = newOwner;
    }

    function getGroup(uint groupId) public view returns(address, address[] memory, string memory) {
        return (groups[groupId].creator, groups[groupId].members, groups[groupId].name);
    }

    function getGroupNameAndCreator(uint groupId) public view returns(string memory, address) {
        return (groups[groupId].name, groups[groupId].creator);
    }

    function getGroupsInfo() public view returns(bool[] memory, bool[] memory) {
        bool[] memory userIsCreator = new bool[](nextGroupId);
        bool[] memory userIsMember = new bool[](nextGroupId);
        for (uint i = 0; i < nextGroupId; i ++) {
            userIsCreator[i] = groups[i].creator == msg.sender;
            userIsMember[i] = groups[i].membersSet[msg.sender];
        }
        return (userIsCreator, userIsMember);
    }

    function createGroup(string memory name, bool addCreatorAsMember) public returns(uint) {
        Group storage group = groups[nextGroupId];
        group.creator = msg.sender;
        if (addCreatorAsMember) {
            group.members.push(msg.sender);
            group.membersSet[msg.sender] = true;
        }
        group.name = name;
        nextGroupId ++;
        return nextGroupId - 1;
    }

    function addMembers(uint groupId, address[] memory newMembers) public {
        require(groups[groupId].creator == msg.sender, "Only the group creator can add members");
        for (uint i = 0; i < newMembers.length; i ++) {
            groups[groupId].members.push(newMembers[i]);
            groups[groupId].membersSet[newMembers[i]] = true;
        }
    }

    function removeMember(uint groupId, address memberToRemove) public {
        require(groups[groupId].creator == msg.sender, "Only the group creator can remove members");
        require(groups[groupId].membersSet[memberToRemove], "Given address is not a member in this group, can't remove it");
        groups[groupId].membersSet[memberToRemove] = false;
        uint index = getIndexOfMember(groupId, memberToRemove);
        uint length = groups[groupId].members.length;
        // overwrite the deletion candidate with the last element
        groups[groupId].members[index] = groups[groupId].members[length - 1];
        // then delete the last element, via https://ethereum.stackexchange.com/a/1528/56047
        delete groups[groupId].members[length - 1];
        groups[groupId].members.length --; // via https://stackoverflow.com/a/51171477/2474159
    }

    function getIndexOfMember(uint groupId, address member) private view returns(uint) {
        Group memory group = groups[groupId];
        for (uint i = 0; i < group.members.length; i ++) {
            if (group.members[i] == member) {
                return i;
            }
        }
        return INVALID_INDEX;
    }

    function isMember(uint groupId, address memberToCheck) public view returns(bool) {
        return groups[groupId].membersSet[memberToCheck];
    }

    // can contain zero addresses
    function getGroupMembers(uint groupId) public view returns(address[] memory) {
        return groups[groupId].members;
    }
}
