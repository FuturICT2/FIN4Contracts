pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Groups.sol";

contract BlockThese is Fin4BaseVerifierType {

    constructor() public  {
        name = "sc.verifier.block-these.name";
        description = "sc.verifier.block-these.description";
        isAutoCheckable = true;
    }

    address public Fin4GroupsAddress;

    function setFin4GroupsAddress(address Fin4GroupsAddr) public {
        Fin4GroupsAddress = Fin4GroupsAddr;
    }

    // @Override
    function autoCheck(address user, address tokenAddress, uint claimId) public {
        if (arrayContainsAddress(tokenToBlockedUsers[tokenAddress], user) ||
            Fin4Groups(Fin4GroupsAddress).userIsInOneOfTheseGroups(tokenToBlockedGroups[tokenAddress], user)) {
            string memory message = string(abi.encodePacked(
                "Your claim on token \'",
                Fin4TokenStub(tokenAddress).name(),
                "\' got rejected from the noninteractive verifier \'BlockThese\' because you are blocked on this token"
                " - either directly or via a group you are a member of"));
            _sendRejectionNotice(address(this), tokenAddress, claimId, message);
        } else {
            _sendApprovalNotice(address(this), tokenAddress, claimId, "");
        }
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address[]:blocked users:,uint[]:blocked groups:";
    }

    // TODO use boolean-mapping for value instead?
    mapping (address => address[]) public tokenToBlockedUsers;
    mapping (address => uint[]) public tokenToBlockedGroups;

    function setParameters(address token, address[] memory blockedUsers, uint[] memory blockedGroupIds) public {
        tokenToBlockedUsers[token] = blockedUsers;
        tokenToBlockedGroups[token] = blockedGroupIds;
    }

}
