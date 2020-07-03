pragma solidity ^0.5.17;

import 'contracts/verifiers/onchain/social/PictureVoting.sol';
import 'contracts/verifiers/onchain/social/VideoVoting.sol';
import 'contracts/verifiers/onchain/social/LimitedVoting.sol';
// import 'contracts/verifiers/*';


contract Fin4Verifying {

    event SubmissionAdded(uint submissionId, address verifierType, address token, address user,
        uint timestamp, uint contentType, string content);

    // all the verifier types that token creators can use
    address[] public verifierTypes;
    mapping (string => address) public verifiers;

    function addVerifierType(address verifierType) public returns(bool) {
        verifierTypes.push(verifierType);
        verifiers[Fin4BaseVerifierType(verifierType).getName()] = verifierType;
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

    function submit_Proof(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName, string memory IPFShash) public {
        if(keccak256(abi.encodePacked((verifierName))) == keccak256(abi.encodePacked(("PictureVoting"))))
            PictureVoting(verifiers[verifierName]).submitProof_PictureVoting(tokenAddrToReceiveVerifierNotice, claimId, IPFShash);
        else if(keccak256(abi.encodePacked((verifierName))) == keccak256(abi.encodePacked(("LimitedVoting"))))
            LimitedVoting(verifiers[verifierName]).submitProof_LimitedVoting(tokenAddrToReceiveVerifierNotice, claimId, IPFShash);
        else if(keccak256(abi.encodePacked((verifierName))) == keccak256(abi.encodePacked(("VideoVoting"))))
            VideoVoting(verifiers[verifierName]).submitProof_VideoVoting(tokenAddrToReceiveVerifierNotice, claimId, IPFShash);
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
