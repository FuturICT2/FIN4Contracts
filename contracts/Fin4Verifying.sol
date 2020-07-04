pragma solidity ^0.5.17;

import 'contracts/stub/Fin4VerifyingStub.sol';
import 'contracts/verifiers/Fin4BaseVerifierType.sol';

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

    // Verifier Parameter Submition
    function setParameters_Whitelisting(address token, string memory verifierName, address[] memory whitelistedUsers, uint[] memory whitelistedGroupIds) public{
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, whitelistedUsers, whitelistedGroupIds);
    }
    function setParameters_Blacklisting(address token,string memory verifierName, address[] memory blacklistedUsers, uint[] memory blacklistedGroupIds) public{
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, blacklistedUsers, blacklistedGroupIds);
    }
    function setParameters_ClaimableOnlyNTimesPerUser(address token, string memory verifierName, uint claimsCap) public{
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, claimsCap);
    }
    function setParameters_Location(address token, string memory verifierName, string memory latLonString, uint maxDistance) public{
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, latLonString, maxDistance);
    }
    function setParameters_MaximumQuantityPerInterval(address token, string memory verifierName, uint interval, uint maxQuantity) public{
         Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, interval, maxQuantity);
    }
    function setParameters_MinimumInterval(address token, string memory verifierName, uint minimumInterval) public{
         Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, minimumInterval);
    }
    function setParameters_Password(address token, string memory verifierName, string memory password) public{
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, password);
    }
    function setParameters_SensorOneTimeSignal(address token, string memory verifierName, string memory sensorID) public {
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, sensorID);
    }
    function setParameters_ApprovalByGroupMember(address token, string memory verifierName, uint groupId) public {
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, groupId);
    }
    function setParameters_SelfieTogether(address token, string memory verifierName, uint groupId) public {
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, groupId);
    }
    function setParameters_LimitedVoting(address token, string memory verifierName, uint nbUsers, uint timeInMinutes) public{
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, nbUsers, timeInMinutes);
    }
    function setParameters_PictureVoting(address token, string memory verifierName, uint nbUsers, uint timeInMinutes) public{
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, nbUsers, timeInMinutes);
    }
    function setParameters_VideoVoting(address token, string memory verifierName, uint nbUsers, uint timeInMinutes) public{
        Fin4VerifyingStub(verifiers[verifierName]).setParameters(token, nbUsers, timeInMinutes);
    }
    // Proof Submission
    function submit_Proof(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName, string memory IPFShash) public {
        if(keccak256(abi.encodePacked((verifierName))) == keccak256(abi.encodePacked(("PictureVoting"))))
            Fin4VerifyingStub(verifiers[verifierName]).submitProof_PictureVoting(tokenAddrToReceiveVerifierNotice,claimId,IPFShash);
        else if(keccak256(abi.encodePacked((verifierName))) == keccak256(abi.encodePacked(("LimitedVoting"))))
            Fin4VerifyingStub(verifiers[verifierName]).submitProof_LimitedVoting(tokenAddrToReceiveVerifierNotice,claimId,IPFShash);
        else if(keccak256(abi.encodePacked((verifierName))) == keccak256(abi.encodePacked(("VideoVoting"))))
            Fin4VerifyingStub(verifiers[verifierName]).submitProof_VideoVoting(tokenAddrToReceiveVerifierNotice,claimId,IPFShash);
    }
    function submitProof_Picture(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName, address approver, string memory IPFShash) public{
        Fin4VerifyingStub(verifiers[verifierName]).submitProof_Picture(tokenAddrToReceiveVerifierNotice, claimId, approver, IPFShash);
    }
    function submitProof_SpecificAddress(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName, address approver) public{
        Fin4VerifyingStub(verifiers[verifierName]).submitProof_SpecificAddress(tokenAddrToReceiveVerifierNotice,claimId,approver);
    }
    function submitProof_Location_Server(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName, int256 lat1, int256 lon1) public {
        Fin4VerifyingStub(verifiers[verifierName]).submitProof_Location_Server(tokenAddrToReceiveVerifierNotice,claimId,lat1,lon1);
    }
    function submitProof_TokenCreatorApproval(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName) public {
        Fin4VerifyingStub(verifiers[verifierName]).submitProof_TokenCreatorApproval(tokenAddrToReceiveVerifierNotice, claimId);
    }
    function submitProof_Password(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName, string memory password) public{
        Fin4VerifyingStub(verifiers[verifierName]).submitProof_Password(tokenAddrToReceiveVerifierNotice,claimId,password);
    }
    function submitProof_MaximumQuantityPerInterval(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName) public{
        Fin4VerifyingStub(verifiers[verifierName]).submitProof_MaximumQuantityPerInterval(tokenAddrToReceiveVerifierNotice,claimId);
    }
    function submitProof_MinimumInterval(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName) public{
        Fin4VerifyingStub(verifiers[verifierName]).submitProof_MinimumInterval(tokenAddrToReceiveVerifierNotice,claimId);
    }
    function submitProof_SelfApprove(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory verifierName) public{
        Fin4VerifyingStub(verifiers[verifierName]).submitProof_SelfApprove(tokenAddrToReceiveVerifierNotice,claimId);
    }
    // function sensorSignalReceived(string memory sensorID, uint timestamp, string memory data) public{
        // Fin4VerifyingStub(verifiers["SensorOneTimeSignal"]).sensorSignalReceived(sensorID,timestamp,data);
    // }

    // Voting Interaction
    function receiveApprovalFromSpecificAddress(string memory verifierName, uint claimId, string memory attachedMessage) public {
        Fin4VerifyingStub(verifiers[verifierName]).receiveApprovalFromSpecificAddress(claimId, attachedMessage);
    }

    function receiveRejectionFromSpecificAddress(string memory verifierName, uint claimId, string memory attachedMessage) public {
        Fin4VerifyingStub(verifiers[verifierName]).receiveRejectionFromSpecificAddress(claimId, attachedMessage);
    }

    function endVote(string memory verifierName, uint claimId) public{
        Fin4VerifyingStub(verifiers[verifierName]).endVote(claimId);
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
