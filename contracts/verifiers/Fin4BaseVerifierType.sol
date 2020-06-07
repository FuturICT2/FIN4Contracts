pragma solidity ^0.5.17;

import "contracts/stub/Fin4TokenStub.sol";
import "contracts/util/utils.sol";

contract Fin4BaseVerifierType is utils {

    string public contractName;
    string public name;
    string public description;
    bool public isAutoInitiable = false; // shortcuts the user clicking on "Initiate verifier", instead that's done automatically
    bool public isNoninteractive = false;

    function setContractName(string memory _contractName) public {
        contractName = _contractName;
    }

    function getName() public view returns(string memory) {
        return name;
    }

    function getDescription() public view returns(string memory) {
        return description;
    }

    function getInfo() public view returns(string memory, string memory, string memory, string memory, bool) {
        return (contractName, name, description, getParameterForTokenCreatorToSetEncoded(), isNoninteractive);
    }

    // This method gets overriden by the verifier types and encode the parameter names
    // to be filled by the token creator. He gets prompted to set them in the token creation process
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "";
    }

    // Helper method for all verifier types to go through the same method when sending their approvals
    // to the respective claim on a token
    function _sendApprovalNotice(address verifierTypeAddress, address tokenAddrToReceiveVerifierNotice, uint claimId,
        string memory message) internal {
        // TODO ensure it can only be called from within this SC?
        Fin4TokenStub(tokenAddrToReceiveVerifierNotice).receiveVerifierApprovalNotice(verifierTypeAddress, claimId, message);
    }

    function _sendRejectionNotice(address verifierTypeAddress, address tokenAddrToReceiveVerifierNotice, uint claimId,
        string memory message) internal {
        Fin4TokenStub(tokenAddrToReceiveVerifierNotice).receiveVerifierRejectionNotice(verifierTypeAddress, claimId, message);
    }

    function _sendPendingNotice(address verifierTypeAddress, address tokenAddrToReceiveVerifierNotice, uint claimId,
        string memory message) internal {
        Fin4TokenStub(tokenAddrToReceiveVerifierNotice).receiveVerifierPendingNotice(verifierTypeAddress, claimId, message);
    }

    // Used by verifier types that require the token creator to approve something
    function getCreatorOfToken(address tokenAddress) public view returns(address) {
        return Fin4TokenStub(tokenAddress).getTokenCreator();
    }

    // On purpose not abstract so that deriving classes don't HAVE to implement it
    function autoSubmitProof(address user, address tokenAddrToReceiveVerifierNotice, uint claimId) public {}
    function autoCheck(address user, address tokenAddrToReceiveVerifierNotice, uint claimId) public {}

}
