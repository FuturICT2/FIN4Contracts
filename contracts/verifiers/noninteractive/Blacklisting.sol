pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Groups.sol";

contract Blacklisting is Fin4BaseVerifierType {

    constructor(address Fin4MessagingAddress)
    Fin4BaseVerifierType(Fin4MessagingAddress)
    public {
        name = "Blacklisting";
        description = "The token creator defines group(s) and/or individual accounts that can not claim a token";
        isNoninteractive = true;
    }

    address public Fin4GroupsAddress;

    function setFin4GroupsAddress(address Fin4GroupsAddr) public {
        Fin4GroupsAddress = Fin4GroupsAddr;
    }

    // @Override
    function autoCheck(address user, address tokenAddress, uint claimId) public {
        if (arrayContainsAddress(tokenToBlacklistedUsers[tokenAddress], user) ||
            Fin4Groups(Fin4GroupsAddress).userIsInOneOfTheseGroups(tokenToBlacklistedGroups[tokenAddress], user)) {
            string memory message = string(abi.encodePacked(
                "Your claim on token \'",
                Fin4TokenStub(tokenAddress).name(),
                "\' got rejected from the constraint \'Blacklisting\' because you are blacklisted on this token"
                " - either directly or via a group you are a member of"));
            Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), user, message);
            _sendRejectionNotice(address(this), tokenAddress, claimId);
        } else {
            _sendApprovalNotice(address(this), tokenAddress, claimId);
        }
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address[]:blacklisted users:,uint[]:blacklisted groups:";
    }

    // TODO use boolean-mapping for value instead?
    mapping (address => address[]) public tokenToBlacklistedUsers;
    mapping (address => uint[]) public tokenToBlacklistedGroups;

    function setParameters(address token, address[] memory blacklistedUsers, uint[] memory blacklistedGroupIds) public {
        tokenToBlacklistedUsers[token] = blacklistedUsers;
        tokenToBlacklistedGroups[token] = blacklistedGroupIds;
    }

}
