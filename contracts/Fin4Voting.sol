pragma solidity ^0.5.17;

import "contracts/Fin4Groups.sol";

contract Fin4Voting{

    event Voter(address voterAddress, address[] currentVotings);
    struct VoterInfo {
        address[] currentVotings;
        string content;
        address voter;

    }
    mapping (address => VoterInfo) public voters;
    address[] public votersAddresses;

    mapping (address => uint) index;
    address[] store;

    address public creator;
    address public Fin4SystemParametersAddress;

    address public Fin4GroupsAddress;

    function setFin4GroupsAddress(address Fin4GroupsAddr) public {
        Fin4GroupsAddress = Fin4GroupsAddr;
    }

    constructor(address Fin4SystemParametersAddr) public {
        creator = msg.sender;
        Fin4SystemParametersAddress = Fin4SystemParametersAddr;
    }

    function becomeVoter() public {
        require(voters[msg.sender].voter == address(0), "You are already a voter!");

        voters[msg.sender] = VoterInfo(new address[](0), 'todocomment', msg.sender);
        votersAddresses.push(msg.sender);
    }

    function isEligibleToBeAVoter() public returns(bool) {
        require(isVoter(msg.sender)==false);
        return isVoter(msg.sender)==false; //TODO ADD CHECK OF REP OF USER
    }

    function isVoter(address add) public view returns(bool) {
        return voters[add].voter != address(0);
    }

    function createRandomGroupOfUsers(uint numberOfUsers,  string memory groupName)  public returns(uint) {
        
        require(numberOfUsers >=votersAddresses.length, "Not enough active voters in the system!" );


        uint startIdx = uint(blockhash(block.number-1))%votersAddresses.length;
        // uint interval = uint(blockhash(block.number-2))%(votersAddresses.length/numberOfUsers);
        uint interval = 1;
        uint groupId = Fin4Groups(Fin4GroupsAddress).createGroup(groupName, false);

        // address[] memory newVoters = new address[](numberOfUsers);
        for(uint i=0; i<numberOfUsers; i++){
            address who = votersAddresses[(startIdx + i*interval)%votersAddresses.length];
            addToArray(who);
        }

        Fin4Groups(Fin4GroupsAddress).addMembers(groupId, store);
        for(uint i = 0; i<store.length; i++){
            delete index[store[i]];
        }
        delete store;
        return groupId;
    }

    function addToArray(address who) public {
        if (!inArray(who)) {
            // Append
            index[who] = store.length + 1;
            store.push(who);
        }
    }

    function inArray(address who) public view returns (bool) {
        // address 0x0 is not valid if pos is 0 is not in the array
        if (index[who] > 0) {
            return true;
        }
        return false;
    }


    function allVoters() public {
        require(voters[msg.sender].voter != address(0), "Only registered voters can see other ones!");

        for (uint i=0; i<votersAddresses.length; i++) {
            emit Voter(votersAddresses[i], voters[votersAddresses[i]].currentVotings);
        }
    }



}
