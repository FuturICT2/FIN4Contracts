pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4TokenBase.sol";
import "contracts/Fin4Groups.sol";

contract ApprovalByGroupMember is Fin4BaseProofType {

    constructor(address Fin4MessagingAddress)
        Fin4BaseProofType(Fin4MessagingAddress)
        public {
            setNameAndDescription();
        }

    address public Fin4GroupsAddress;

    function setFin4GroupsAddress(address Fin4GroupsAddr) public {
        Fin4GroupsAddress = Fin4GroupsAddr;
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

    // @Override
    function getParameterForActionTypeCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:Group Id:can be found in the overview of groups";
    }

    // @Override
    function parametersSanityCheck(uint[] memory params) public view returns(bool) {
        return Fin4Groups(Fin4GroupsAddress).groupExists(params[0]);
    }

    function _getGroupId(address token) private view returns(uint) {
        return fin4TokenToParametersSetOnThisProofType[token][0];
    }
}
