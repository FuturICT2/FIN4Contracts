pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4TokenBase.sol";

contract ApprovalByGroupMember is Fin4BaseProofType {

    constructor(address Fin4MessagingAddress)
        Fin4BaseProofType(Fin4MessagingAddress)
        public {
            setNameAndDescription();
        }

    function setNameAndDescription() public returns(bool) {
        name = "ApprovalByGroupMember";
        description = "The token creator specifies one or more user groups, of which one member has to approve.";
    }

    function submitProof_ApprovalByGroupMember(address tokenAdrToReceiveProof, uint claimId) public {
        // TODO
    }

    function getMessageText() public pure returns(string memory) {
        return "You are a member of a user group that was appointed for approving this claim on the action type ";
    }

}
