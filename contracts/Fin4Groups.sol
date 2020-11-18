pragma solidity >=0.5.17;

import 'contracts/Fin4Messaging.sol';
import "contracts/util/utils.sol";

contract Fin4Groups is utils {

    address public Fin4MessagingAddress;

    constructor(address Fin4MessagingAddr) public {
        Fin4MessagingAddress = Fin4MessagingAddr;
    }

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

    function DeleteGroup(uint groupId) public{
        delete groups[groupId];
    }

    modifier userIsCreator(uint groupId) {
        require(groups[groupId].creator == msg.sender, "User is not group creator");
        _;
    }

    function transferOwnership(uint groupId, address newOwner) public userIsCreator(groupId) {
        groups[groupId].creator = newOwner;
    }

    function getGroup(uint groupId) public view returns(address, address[] memory, string memory) {
        return (groups[groupId].creator, groups[groupId].members, groups[groupId].name);
    }

    function getGroupNameAndCreator(uint groupId) public view returns(string memory, address) {
        return (groups[groupId].name, groups[groupId].creator);
    }

    function getGroupsInfo() public view returns(bool[] memory, bool[] memory) {
        bool[] memory userIsCreatorArr = new bool[](nextGroupId);
        bool[] memory userIsMemberArr = new bool[](nextGroupId);
        for (uint i = 0; i < nextGroupId; i ++) {
            userIsCreatorArr[i] = groups[i].creator == msg.sender;
            userIsMemberArr[i] = groups[i].membersSet[msg.sender];
        }
        return (userIsCreatorArr, userIsMemberArr);
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

    function addMembers(uint groupId, address[] memory newMembers) public  userIsCreator(groupId) {
        for (uint i = 0; i < newMembers.length; i ++) {
            groups[groupId].members.push(newMembers[i]);
            groups[groupId].membersSet[newMembers[i]] = true;
        }
    }

    function removeMember(uint groupId, address memberToRemove, bool notifyOwner) public {
        require(groups[groupId].creator == msg.sender || msg.sender == memberToRemove,
            "User is not group creator or removes himself");
        require(groups[groupId].membersSet[memberToRemove], "Given address is not a member in this group, can't remove it");
        groups[groupId].membersSet[memberToRemove] = false;
        uint index = getIndexOfMember(groupId, memberToRemove);
        uint length = groups[groupId].members.length;
        // overwrite the deletion candidate with the last element
        groups[groupId].members[index] = groups[groupId].members[length - 1];
        // then delete the last element, via https://ethereum.stackexchange.com/a/1528/56047
        delete groups[groupId].members[length - 1];
        groups[groupId].members.length --; // via https://stackoverflow.com/a/51171477/2474159
        if (notifyOwner) {
            string memory message = string(abi.encodePacked("User ", addressToString(memberToRemove),
            " has left your group ", groups[groupId].name, " (ID: ", uint2str(groupId), ")."));
            Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), groups[groupId].creator, message);
        }
    }

    function getIndexOfMember(uint groupId, address member) public view returns(uint) {
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

    // used by ApprovalByUsersOrGroups and in the BlockThese and AllowOnlyThese noninteractive verifiers
    function userIsInOneOfTheseGroups(uint[] memory groupIds, address user) public view returns(bool) {
        for (uint i = 0; i < groupIds.length; i ++) {
            if (isMember(groupIds[i], user)) {
                return true;
            }
        }
        return false;
    }
}
