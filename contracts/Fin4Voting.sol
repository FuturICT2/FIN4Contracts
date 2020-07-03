pragma solidity ^0.5.17;

import 'contracts/stub/Fin4TokenStub.sol';

contract Fin4Voting{

    event Voter(address voterAddress, address[] currentVotings);
    struct VoterInfo {
        address[] currentVotings;
        string content;
        address voter;
    }
    address public Fin4ReputationAddress;

    mapping (address => VoterInfo) public voters;
    address[] public votersAddresses;

    mapping (address => uint) index;
    address[] store;

    address public creator;
    address public Fin4SystemParametersAddress;

    function setFin4ReputationAddress(address Fin4ReputationAddr) public {
        require(msg.sender == creator, "Only the creator of this smart contract can call this function");
        Fin4ReputationAddress = Fin4ReputationAddr;
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
        if(Fin4TokenStub(Fin4ReputationAddress).balanceOf(msg.sender) > 100 && !isVoter(msg.sender))
            return true;
        return false;
    }

    function isVoter(address add) public view returns(bool) {
        return voters[add].voter != address(0);
    }

    function createRandomGroupOfUsers(uint numberOfUsers,  string memory groupName, address claimer)  public returns(address[] memory) {
        
        uint subtractNumberOfVoters = 0;

        if(isVoter(claimer)){
            subtractNumberOfVoters = 1;
        }

        require(numberOfUsers <= (votersAddresses.length -subtractNumberOfVoters ), "Not enough active voters in the system!" );

        uint startIdx = uint(blockhash(block.number-1))%votersAddresses.length;
        uint interval = uint(blockhash(block.number-2))%3;
        // uint groupId = Fin4Groups(Fin4GroupsAddress).createGroup(groupName, false);

        address[] memory newVoters = new address[](numberOfUsers);

        for(uint i = 0; i<numberOfUsers; i++){
            address who = votersAddresses[(startIdx + i*interval)%votersAddresses.length];

            uint offset = 1;
            while(who ==claimer || inArray(who, newVoters)){
                    who = votersAddresses[(startIdx + i*interval +offset)%votersAddresses.length];
                    offset = offset +1;
            }
            newVoters[i] = who;
        }

        // Fin4Groups(Fin4GroupsAddress).addMembers(groupId, newVoters);
        return newVoters;
    }

    function inArray(address who, address[] memory arr) public view returns (bool) {
        // address 0x0 is not valid if pos is 0 is not in the array
        for(uint i = 0; i<arr.length; i++){
            if(arr[i] == who){
                return true;
            }
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
