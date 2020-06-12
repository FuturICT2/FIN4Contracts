pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4Groups.sol";

contract AllowOnlyThese is Fin4BaseVerifierType { // TODO make it extend BlockThese?

    constructor() public  {
        name = "sc.verifier.allow-only-these.name";
        description = "sc.verifier.allow-only-these.description";
        isNoninteractive = true;
    }

    address public Fin4GroupsAddress;

    function setFin4GroupsAddress(address Fin4GroupsAddr) public {
        Fin4GroupsAddress = Fin4GroupsAddr;
    }

    // @Override
    function autoCheck(address user, address tokenAddress, uint claimId) public {
        if (arrayContainsAddress(tokenToPermittedUsers[tokenAddress], user) ||
            Fin4Groups(Fin4GroupsAddress).userIsInOneOfTheseGroups(tokenToPermittedGroups[tokenAddress], user)) {
            _sendApprovalNotice(address(this), tokenAddress, claimId, "");
        } else {
            string memory message = string(abi.encodePacked(
                "Your claim on token \'",
                Fin4TokenStub(tokenAddress).name(),
                "\' got rejected from the noninteractive verifier \'AllowOnlyThese\' because you are not allowed to claim this token"
                " - neither directly nor via group membership"));
            _sendRejectionNotice(address(this), tokenAddress, claimId, message);
        }
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "address[]:permitted users:,uint[]:permitted groups:";
    }

    // TODO use boolean-mapping for value instead? 
    mapping (address => address[]) public tokenToPermittedUsers;
    mapping (address => uint[]) public tokenToPermittedGroups;

    function setParameters(address token, address[] memory permittedUsers, uint[] memory permittedGroupIds) public {
        tokenToPermittedUsers[token] = permittedUsers;
        tokenToPermittedGroups[token] = permittedGroupIds;
    }

}
