pragma solidity ^0.5.17;

import 'contracts/stub/Fin4VerifyingStub.sol';
import 'contracts/verifiers/Fin4BaseVerifierType.sol';
// Contract that handles communication between the FIN4 system and the verifier system
contract Fin4Verifying {

    event SubmissionAdded(uint submissionId, address verifierType, address token, address user,
        uint timestamp, uint contentType, string content);

    // all the verifier types that token creators can use
    address[] public verifierTypes;
    mapping (string => address) public verifiers;
    address public Fin4VotingAddress;

    // Set in 2_deploy_contracts.js
    function setFin4VotingAddress(address Fin4VotingAddr) public {
        Fin4VotingAddress = Fin4VotingAddr;
    }

    function addVerifierType(address verifierType) public returns(bool) {
        verifierTypes.push(verifierType);
        verifiers[Fin4BaseVerifierType(verifierType).getName()] = verifierType;
        return true;
    }

    function getVerifierTypes() public view returns(address[] memory) {
        return verifierTypes;
    }

    function getVerifierTypeInfo(address verifierType) public view returns(string memory, string memory, string memory, string memory) {
        // require(verifierTypeIsRegistered(verifierType), "Address is not registered as verifier type");
        return Fin4BaseVerifierType(verifierType).getInfo();
    }

    // called from Fin4Token instances to ensure the required verifier types there are a subset of the verifierTypes here
    function verifierTypeIsRegistered(address verifierTypeToCheck) public view returns(bool) {
        for (uint i = 0; i < verifierTypes.length; i++) {
            if (verifierTypes[i] == verifierTypeToCheck) {
                return true;
            }
        }
        return false;
    }

    // ------------------------- VOTING INTERACTION -------------------------

    function isEligibleToBeAVoter() public returns(bool) {
        return Fin4VerifyingStub(Fin4VotingAddress).isEligibleToBeAVoter(msg.sender);
    }

    function becomeVoter() public {
        Fin4VerifyingStub(Fin4VotingAddress).becomeVoter(msg.sender);
    }

    // TODO

    function receiveApprovalFromSpecificAddress(string memory verifierName, uint pendingApprovalId, string memory attachedMessage) public {
        Fin4VerifyingStub(verifiers[verifierName]).receiveApprovalFromSpecificAddress(pendingApprovalId, msg.sender, attachedMessage);
    }

    function receiveRejectionFromSpecificAddress(string memory verifierName, uint pendingApprovalId, string memory attachedMessage) public {
        Fin4VerifyingStub(verifiers[verifierName]).receiveRejectionFromSpecificAddress(pendingApprovalId, msg.sender, attachedMessage);
    }

    function endVote(string memory verifierName, uint claimId) public {
        Fin4VerifyingStub(verifiers[verifierName]).endVote(claimId);
    }


    // ------------------------- COLLECTING SUBMISSIONS -------------------------

    struct Submission {
        uint submissionId;
        address verifierType; // The verifier type who sent this submission in
        address token;
        address user;
        uint timestamp;
        uint contentType; // 0 = text, 1 = picture (IPFS hash), 2 = vote / TODO use enum
        string content;
    }

    Submission[] public submissions; // submissions() used directly as getter in frontend
    uint public nextSubmissionId = 0;

    function addSubmission(address verifierType, address token, address user, uint timestamp, uint contentType, string memory content) public {
        submissions.push(Submission(nextSubmissionId, verifierType, token, user, timestamp, contentType, content));
        emit SubmissionAdded(nextSubmissionId, verifierType, token, user, timestamp, contentType, content);
        nextSubmissionId += 1;
    }

    function getSubmissionsCount() public view returns(uint) {
        return submissions.length;
    }
}
