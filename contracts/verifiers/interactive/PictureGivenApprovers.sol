pragma solidity ^0.5.17;

import "contracts/verifiers/interactive/ApprovalByUsersOrGroups.sol";

contract PictureGivenApprovers is ApprovalByUsersOrGroups {

    constructor() public {}

    // @Override
    function init() public {
        name = "sc.verifier.picture-given-approvers.name";
        description = "sc.verifier.picture-given-approvers.description";
    }

}
