pragma solidity ^0.5.17;

import "contracts/verifiers/onchain/social/SpecificAddress.sol";

contract TokenCreatorApproval is SpecificAddress {

    constructor() public {}

    // @Override
    function init() public {
        name = "sc.verifier.token-creator-approval.name";
        description = "sc.verifier.token-creator-approval.description";
    }

    function submitProof_TokenCreatorApproval(address tokenAddrToReceiveVerifierNotice, uint claimId, address claimer) public {
        // Sends a message to the token claimer so that he either approves or rejects
        submitProof_SpecificAddress(tokenAddrToReceiveVerifierNotice, claimId, claimer, getCreatorOfToken(tokenAddrToReceiveVerifierNotice));
    }

    // @Override
    function getMessageText() public pure returns(string memory) {
        return "You as the token creator were requested to approve the verifier type TokenCreatorApproval on the token ";
    }

}
