pragma solidity ^0.5.0;

import 'contracts/proof/Fin4BaseProofType.sol';

contract Fin4Proving {

    event SubmissionAdded(uint submissionId, address proofType, address token, address user, uint timestamp, uint contentType, string content);

    // all the proof types that token creators can use
    address[] public proofTypes;

    function addProofType(address proofType) public returns(bool) {
        proofTypes.push(proofType);
        return true;
    }

    function getProofTypes() public view returns(address[] memory) {
        return proofTypes;
    }

    function getProofTypeInfo(address proofType) public view returns(string memory, string memory, string memory, bool) {
        // require(proofTypeIsRegistered(proofType), "Address is not registered as proof type");
        return Fin4BaseProofType(proofType).getInfo();
    }

    // called from Fin4Token instances to ensure the required proof types there are a subset of the proofTypes here
    function proofTypeIsRegistered(address proofTypeToCheck) public view returns(bool) {
        for (uint i = 0; i < proofTypes.length; i++) {
            if (proofTypes[i] == proofTypeToCheck) {
                return true;
            }
        }
        return false;
    }

    // ------------------------- COLLECTING SUBMISSIONS -------------------------

    struct Submission {
        uint submissionId;
        address proofType; // The proof type who sent this submission in
        address token;
        address user;
        uint timestamp;
        uint contentType; // 0 = text, 1 = picture (IPFS hash)
        string content;
    }

    Submission[] public submissions; // submissions() used directly as getter in frontend
    uint public nextSubmissionId = 0;

    function addSubmission(address proofType, address token, address user, uint timestamp, uint contentType, string memory content) public {
        submissions.push(Submission(nextSubmissionId, proofType, token, user, timestamp, contentType, content));
        emit SubmissionAdded(nextSubmissionId, proofType, token, user, timestamp, contentType, content);
        nextSubmissionId += 1;
    }

    function getSubmissionsCount() public view returns(uint) {
        return submissions.length;
    }
}
