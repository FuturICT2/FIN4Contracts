pragma solidity ^0.5.17;

import "contracts/verifiers/interactive/ApprovalByUsersOrGroups.sol";

contract PictureGivenApprovers is ApprovalByUsersOrGroups {

    // @Override
    function init() public {
        name = "sc.verifier.picture-given-approvers.name";
        description = "sc.verifier.picture-given-approvers.description";
    }

    function submitProof_PictureGivenApprovers(address tokenAddrToReceiveVerifierNotice, uint claimId, string memory IPFShash) public {
        submitProof(msg.sender, tokenAddrToReceiveVerifierNotice, claimId, IPFShash,
            "The appointed approvers have been notified about your picture approval request.");
    }
}
