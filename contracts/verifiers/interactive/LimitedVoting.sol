pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4TokenBase.sol";
import "contracts/Fin4Groups.sol";
import "contracts/Fin4Messaging.sol";
import "contracts/Fin4TokenManagement.sol";
import 'contracts/stub/MintingStub.sol';
import 'contracts/stub/BurningStub.sol';
import 'contracts/Fin4SystemParameters.sol';

contract LimitedVoting is Fin4BaseVerifierType {
     constructor() public  {
        creator = msg.sender;
        init();
    }

    // function mint(address account, uint256 amount) public returns (bool);
    // function burnFrom(address from, uint256 value) public;

    address public creator;
    address public Fin4GroupsAddress;
    address public Fin4MessagingAddress;
    address public Fin4SystemParametersAddress;
    address public Fin4ReputationAddress;
    address public Fin4TokenManagementAddr;
    // Set in 2_deploy_contracts.js
    function setFin4GroupsAddress(address Fin4GroupsAddr) public {
        Fin4GroupsAddress = Fin4GroupsAddr;
    }
    // Set in 2_deploy_contracts.js
    function setFin4tokenManagementAddress(address Fin4TokenManagementAddress) public {
        Fin4TokenManagementAddr = Fin4TokenManagementAddress;
    }
    // Set in 2_deploy_contracts.js
    function setFin4MessagingAddress(address Fin4MessagingAddr) public {
        Fin4MessagingAddress = Fin4MessagingAddr;
    }
    // Set in 2_deploy_contracts.js
    function setFin4SystemParametersAddress(address SystemParametersAddr) public {
        Fin4SystemParametersAddress = SystemParametersAddr;
    }
    function setFin4ReputationAddress(address Fin4ReputationAddr) public {
        require(msg.sender == creator, "Only the creator of this smart contract can call this function");
        Fin4ReputationAddress = Fin4ReputationAddr;
    }

    // @Override
    function init() public {
        name = "LimitedVoting";
        description = "The proof is sent to the users due to a random mechanism";
        isAutoInitiable = false;
    }

    uint public nextPendingApprovalId = 0;
    mapping (uint => PendingApproval) public pendingApprovals; // just use an array? TODO

    struct PendingApproval {
        uint pendingApprovalId;
        address tokenAddrToReceiveVerifierNotice;
        uint claimIdOnTokenToReceiveVerifierDecision;
        address requester;

        bool isIndividualApprover; // false means group-usage

        uint approverGroupId;
        // the following two arrays belong tightly together
        address[] groupMemberAddresses; // store a snapshot of those here or not? #ConceptualDecision
                                        // if not, a mechanism to mark messages as read is needed
        uint[] messageIds;
        address[] Approved;
        address[] Rejected;
        uint[] reputation;
        string attachment;
        uint nbApproved;
        uint nbRejected;
        bool isApproved; // in case of multiple PendingApprovals waiting for each other
        uint linkedWithPendingApprovalId;
    }

    // @Override
    function submitProof_LimitedVoting(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory IPFShash) public {
        PendingApproval memory pa;
        pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = msg.sender;
        /*
        
        PIOTR CODE Given the number of users to be sent to(which I will implement and provide to you by calling a function)

         */
        // Then on this line we use the group ID you give me
        uint groupId = _getGroupId(tokenAddrToReceiveVerifierNotice);
        // The rest of the code can run as planned
        pa.approverGroupId = groupId;
        pa.pendingApprovalId = nextPendingApprovalId;
        pa.nbApproved = 0;
        pa.nbRejected = 0;
        pa.attachment = IPFShash;
        pa.isIndividualApprover = false;
        string memory message = string(abi.encodePacked(getMessageText(), Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name(),
            ". Consensus is reached using Absolute Majority. The action that is supposed to be done is: ", Fin4TokenBase(tokenAddrToReceiveVerifierNotice).getAction()));

        address[] memory members = Fin4Groups(Fin4GroupsAddress).getGroupMembers(groupId);

        pa.groupMemberAddresses = new address[](members.length);
        pa.Approved = new address[](members.length);
        pa.Rejected = new address[](members.length);
        pa.messageIds = new uint[](members.length);
        pa.reputation = new uint[](members.length);
        for (uint i = 0; i < members.length; i ++) {
            pa.groupMemberAddresses[i] = members[i];
            // pa.reputation[i] = Fin4TokenManagement(Fin4TokenManagementAddr).getBalance(members[i], Fin4ReputationAddress);
            pa.messageIds[i] = Fin4Messaging(Fin4MessagingAddress)
                .addPendingApprovalMessage(msg.sender, name, members[i], message, IPFShash, pa.pendingApprovalId);
        }

        pendingApprovals[nextPendingApprovalId] = pa;
        nextPendingApprovalId ++;

        _sendPendingNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId);
    }

    function getMessageText() public pure returns(string memory) {
        return "You have been randomly selected to participate in voting for this claim on the token ";
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:Number of Users";
    }
    // TO DO: Make this parameter actually number of users instead of group id
    mapping (address => uint) public tokenToParameter;

    function setParameters(address token, uint nbUsers) public {
    //   require(Fin4Groups(Fin4GroupsAddress).groupExists(groupId), "Group ID does not exist");
        // if(nbUsers > 3)
            tokenToParameter[token] = nbUsers;
        // else
            // tokenToParameter[token] = 3;

    }

    function _getGroupId(address token) public view returns(uint) {
        return tokenToParameter[token];
    }

    // copied method signature from SpecificAddress, then nothing has to be changed in Messages.jsx

    function receiveApprovalFromSpecificAddress(uint pendingApprovalId, string memory attachedMessage) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        require(Fin4Groups(Fin4GroupsAddress).isMember(pa.approverGroupId, msg.sender), "You are not a member of the appointed approver group");
        markMessageAsRead(pendingApprovalId, Fin4Groups(Fin4GroupsAddress).getIndexOfMember(pa.approverGroupId, msg.sender));
        pa.Approved[pa.nbApproved] = msg.sender;
        pa.nbApproved = pa.nbApproved + 1;
        if(pa.nbApproved > pa.groupMemberAddresses.length/2){
            markMessagesAsRead(pendingApprovalId);
            uint REPS = 0;
            uint REPF = 0;
            if(pa.nbApproved != 0)
                REPS = Fin4SystemParameters(Fin4SystemParametersAddress).REPforSuccesfulVote() / pa.nbApproved;
            if(pa.nbRejected != 0)
                REPF = Fin4SystemParameters(Fin4SystemParametersAddress).REPforFailedVote() / pa.nbRejected;
            // Reward voters that approved
            for (uint i = 0; i < pa.nbApproved; i++) {
               MintingStub(Fin4ReputationAddress).mint(pa.Approved[i], REPS);
            }
            // Punish voters that rejected
            for (uint i = 0; i < pa.nbRejected; i++) {
               BurningStub(Fin4ReputationAddress).burnFrom(pa.Rejected[i], REPF);
            }
            _sendApprovalNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, attachedMessage);
            Fin4Groups(Fin4GroupsAddress).DeleteGroup(pa.approverGroupId);
        }
        pendingApprovals[pendingApprovalId] = pa;
    }

    function receiveRejectionFromSpecificAddress(uint pendingApprovalId, string memory attachedMessage) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        require(Fin4Groups(Fin4GroupsAddress).isMember(pa.approverGroupId, msg.sender), "You are not a member of the appointed approver group");
        markMessageAsRead(pendingApprovalId, Fin4Groups(Fin4GroupsAddress).getIndexOfMember(pa.approverGroupId, msg.sender));
        string memory message = string(abi.encodePacked(
            "A member of the appointed approver group has rejected your approval request for ",
            Fin4TokenBase(pa.tokenAddrToReceiveVerifierNotice).name()));
        if (bytes(attachedMessage).length > 0) {
            message = string(abi.encodePacked(message, ': ', attachedMessage));
        }
        pa.Rejected[pa.nbRejected] = msg.sender;
        pa.nbRejected = pa.nbRejected + 1;
        if(pa.nbRejected > pa.groupMemberAddresses.length/2){
            uint REPS = 0;
            uint REPF = 0;
            markMessagesAsRead(pendingApprovalId);
            if(pa.nbApproved != 0)
                REPS = Fin4SystemParameters(Fin4SystemParametersAddress).REPforSuccesfulVote() / pa.nbRejected;
            if(pa.nbRejected != 0)
                REPF = Fin4SystemParameters(Fin4SystemParametersAddress).REPforFailedVote() / pa.nbApproved;
            for (uint i = 0; i < pa.nbRejected; i++) {
                MintingStub(Fin4ReputationAddress).mint(pa.Rejected[i], REPS);
            }
            for (uint i = 0; i < pa.nbApproved; i++) {
                BurningStub(Fin4ReputationAddress).burnFrom(pa.Approved[i], REPF);
            }
            _sendRejectionNotice(address(this), pa.tokenAddrToReceiveVerifierNotice, pa.claimIdOnTokenToReceiveVerifierDecision, message);
            Fin4Groups(Fin4GroupsAddress).DeleteGroup(pa.approverGroupId);
        }
        pendingApprovals[pendingApprovalId] = pa;
    }
    // Mark messages of all users as read
    function markMessagesAsRead(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        for (uint i = 0; i < pa.messageIds.length; i ++) {
            Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(pa.groupMemberAddresses[i], pa.messageIds[i]);
        }
    }
    // Mark message of current user as read
    function markMessageAsRead(uint pendingApprovalId, uint index) public {
        PendingApproval memory pa = pendingApprovals[pendingApprovalId];
        Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(pa.groupMemberAddresses[index], pa.messageIds[index]);
    }
}