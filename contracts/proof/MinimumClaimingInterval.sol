pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract MinimumClaimingInterval is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "MinimumClaimingInterval";
      description = "Defines a minimum time that has to pass between claims.";
    }

    function submitProof(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
      require(minimumIntervalRequirementMet(), "The required minimum time between two claim submissions hasn't passed yet.");
      _sendApproval(tokenAdrToReceiveProof, claimId);
      return true;
    }

    function minimumIntervalRequirementMet() private view returns(bool) {

        // TODO

        return true;
    }

    // @Override
    function getSubmitProofMethodArgsCount() public view returns(uint) {
      return 2;
    }

    uint minimumInterval = 0; // in ms

    function setMinimumInterval(address tokenAddressUsingThisProofType, uint _minimumInterval) public returns(bool) {
        require(fin4TokenToItsCreator[tokenAddressUsingThisProofType] == msg.sender, "Only the token creator can set this value.");
        minimumInterval = _minimumInterval;
        return true;
    }

}
