pragma solidity ^0.5.17;

import "contracts/stub/Fin4TokenStub.sol";
import "contracts/util/utils.sol";

contract Fin4BaseVerifierType is utils {

    string public contractName;
    string public name;
    string public description;
    bool public isAutoInitiable = false; // shortcuts the user clicking on "Initiate verifier", instead that's done automatically
    bool public isAutoCheckable = false; // TODO unify this logic with isAutoInitiable?

    function setContractName(string memory _contractName) public {
        contractName = _contractName;
    }

    function getName() public view returns(string memory) {
        return name;
    }

    function getDescription() public view returns(string memory) {
        return description;
    }

    function getInfo() public view returns(string memory, string memory, string memory, string memory) {
        return (contractName, name, description, getParameterForTokenCreatorToSetEncoded());
    }

    // This method gets overriden by the verifier types and encode the parameter names
    // to be filled by the token creator. He gets prompted to set them in the token creation process
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "";
    }

    function statusIsUndecided(address token, uint claimId) internal returns(bool) {
        // from enum Status in Fin4TokenBase: 0 = UNSUBMITTED, 1 = PENDING, 2 = APPROVED, 3 = REJECTED
        uint status = Fin4TokenStub(token).getVerifierStatus(address(this), claimId);
        require(status != 2 && status != 3, "This verifier is already decided");
    }

    // Helper method for all verifier types to go through the same method when sending their approvals
    // to the respective claim on a token
    function _sendApprovalNotice(address verifierTypeAddress, address tokenAddrToReceiveVerifierNotice, uint claimId,
        string memory message) internal {
        // TODO ensure it can only be called from within this SC?
        statusIsUndecided(tokenAddrToReceiveVerifierNotice, claimId);
        Fin4TokenStub(tokenAddrToReceiveVerifierNotice).receiveVerifierApprovalNotice(verifierTypeAddress, claimId, message);
    }

    function _sendRejectionNotice(address verifierTypeAddress, address tokenAddrToReceiveVerifierNotice, uint claimId,
        string memory message) internal {
        statusIsUndecided(tokenAddrToReceiveVerifierNotice, claimId);
        Fin4TokenStub(tokenAddrToReceiveVerifierNotice).receiveVerifierRejectionNotice(verifierTypeAddress, claimId, message);
    }

    function _sendPendingNotice(address verifierTypeAddress, address tokenAddrToReceiveVerifierNotice, uint claimId,
        string memory message) internal {
        require(Fin4TokenStub(tokenAddrToReceiveVerifierNotice).getVerifierStatus(address(this), claimId) == 0,
            "This proof is already submitted");
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
