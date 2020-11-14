pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Verifying.sol";

contract Vote is Fin4BaseVerifierType {

    constructor() public  {
        name = "sc.verifier.vote.name";
        description = "sc.verifier.vote.description";
    }

    address public Fin4VerifyingAddress;

    function setFin4VerifyingAddress(address Fin4VerifyingAddr) public {
        Fin4VerifyingAddress = Fin4VerifyingAddr;
    }

    function submitProof_Vote(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory chosenOption) public {
        Fin4Verifying(Fin4VerifyingAddress).addSubmission(address(this), tokenAddrToReceiveVerifierNotice, msg.sender, now, 2, chosenOption);
        _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, chosenOption);
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "string:options:comma separated options";
    }

    mapping (address => string) public tokenToVoteOptionsStrings;

    function setParameters(address token, string memory voteOptionsString) public {
        tokenToVoteOptionsStrings[token] = voteOptionsString;
    }

    function getVoteOptionsStringForToken(address token) public view returns(string memory) {
        return tokenToVoteOptionsStrings[token];
    }

}
