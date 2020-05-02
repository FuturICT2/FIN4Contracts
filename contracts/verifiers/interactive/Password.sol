pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";

contract Password is Fin4BaseVerifierType {

    constructor() public  {
        name = "Password";
        description = "Approval if the user provides the password matching the one the token creator set.";
    }

    function submitProof_Password(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory password) public {
        // via https://ethereum.stackexchange.com/a/30914
        if (keccak256(abi.encodePacked((password))) == keccak256(abi.encodePacked((_getPassword(tokenAddrToReceiveVerifierNotice))))) {
            _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "");
        } else {
            string memory message = string(abi.encodePacked(
                "Your claim on token \'",
                Fin4TokenStub(tokenAddrToReceiveVerifierNotice).name(),
                "\' got rejected from verifier type \'Password\' because the password you",
                " provided does not match the one set by the token creator"));
            _sendRejectionNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, message);
        }
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "string:password:alphanumeric string";
    }

    mapping (address => string) public tokenToParameter;

    function setParameters(address token, string memory password) public {
        tokenToParameter[token] = password;
    }

    function _getPassword(address token) private view returns(string memory) {
        // TODO this must not be visible to someone using truffle console or similar!
        // Use a salt additionally? Or encrypt it with itself? Only possible with numbers (as done in TCR?) #ConceptualDecision
        return tokenToParameter[token];
    }

}
