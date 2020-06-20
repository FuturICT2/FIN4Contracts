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
        require(isVoter()==false);
        return isVoter()==false; //TODO ADD CHECK OF REP OF USER
    }

    function isVoter() public returns(bool) {
        return voters[msg.sender].voter != address(0);
    }

    function createRandomGroupOfUsers(uint numberOfUsers,  string memory groupName)  public returns(uint) {
        
        require(numberOfUsers >=votersAddresses.length, "Not enough active voters in the system!" );


        uint startIdx = uint(blockhash(block.number-1))%votersAddresses.length;
        uint interval = uint(blockhash(block.number-2))%(votersAddresses.length/numberOfUsers);

        uint groupId = Fin4Groups(Fin4GroupsAddress).createGroup(groupName, false);

        address[] memory newVoters = new address[](numberOfUsers);
        for(uint i=0; i<numberOfUsers; i++){
            newVoters[i] = votersAddresses[(startIdx + i*interval)%votersAddresses.length];
        }

        Fin4Groups(Fin4GroupsAddress).addMembers(groupId, newVoters);

        return groupId;
    }


    function allVoters() public {
        require(voters[msg.sender].voter != address(0), "Only registered voters can see other ones!");

        for (uint i=0; i<votersAddresses.length; i++) {
            emit Voter(votersAddresses[i], voters[votersAddresses[i]].currentVotings);
        }




    }



}
