pragma solidity ^0.5.0;

import 'contracts/verifiers/Fin4BaseVerifierType.sol';

contract Fin4Verifying {

    event SubmissionAdded(uint submissionId, address verifierType, address token, address user,
        uint timestamp, uint contentType, string content);

    // all the proof types that token creators can use
    address[] public verifierTypes;

    function addVerifierType(address verifierType) public returns(bool) {
        verifierTypes.push(verifierType);
        return true;
    }

    function getVerifierTypes() public view returns(address[] memory) {
        return verifierTypes;
    }

    function getVerifierTypeInfo(address verifierType) public view returns(string memory, string memory, string memory, bool) {
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

    // ------------------------- COLLECTING SUBMISSIONS -------------------------

    struct Submission {
        uint submissionId;
        address verifierType; // The verifier type who sent this submission in
        address token;
        address user;
        uint timestamp;
        uint contentType; // 0 = text, 1 = picture (IPFS hash)
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
