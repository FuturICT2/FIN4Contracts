pragma solidity ^0.5.17;

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

    constructor(address Fin4SystemParametersAddr) public {
        creator = msg.sender;
        Fin4SystemParametersAddress = Fin4SystemParametersAddr;
    }

    function becomeVoter() public {
        require(voters[msg.sender].voter == address(0), "You are already a voter!");

        voters[msg.sender] = VoterInfo(new address[](0), 'todocomment', msg.sender);
        votersAddresses.push(msg.sender);
    }

    function isVoter() public {
        return voters[msg.sender].voter == address(0)
    }

    function allVoters() public {
        require(voters[msg.sender].voter != address(0), "Only registered voters can see other ones!");

        for (uint i=0; i<votersAddresses.length; i++) {
            emit Voter(votersAddresses[i], voters[votersAddresses[i]].currentVotings);
        }




    }



}
