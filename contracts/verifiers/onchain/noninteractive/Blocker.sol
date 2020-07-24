pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";

contract Blocker is Fin4BaseVerifierType {

    constructor() public  {
        name = "sc.verifier.blocker.name";
        description = "sc.verifier.blocker.description";
        isAutoCheckable = true;
    }

    // @Override
    function autoCheck(address user, address tokenAddress, uint claimId) public {
        string memory message = string(abi.encodePacked(
            "Your claim on token \'",
            Fin4TokenStub(tokenAddress).name(),
            "\' got rejected from the noninteractive verifier \'Blocker\'."));
        _sendRejectionNotice(address(this), tokenAddress, claimId, message);
    }

}
