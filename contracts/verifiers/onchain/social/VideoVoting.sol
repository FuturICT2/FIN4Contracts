pragma solidity ^0.5.17;

import "contracts/verifiers/onchain/social/LimitedVoting.sol";

contract VideoVoting is LimitedVoting {

    constructor() public  {}

    // @Override
    function init() public {
        name = "VideoVoting";
        description = "The claimer has to supply a video, based on which the approver will decide to approve.";
    }

    function submitProof_VideoVoting(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory IPFShash) public {
        super.submitProof_LimitedVoting(tokenAddrToReceiveVerifierNotice, claimId, IPFShash);
    }

    // @Override
    function getMessageText() public pure returns(string memory) {
        // TODO include the quantity into the message
        return "Please check this video verifier and approve the correct amount of this token: ";
    }

}
