pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract MinimumClaimingInterval is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "MinimumClaimingInterval";
      description = "Defines a minimum time that has to pass between claims.";
      minimumInterval = 1 * 24 * 60 * 60 * 1000; // 1 day
      messageType = MessageType.INFO;
    }

    function submitProof(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
      if (minimumIntervalRequirementMet(tokenAdrToReceiveProof, msg.sender, claimId)) {
        _sendApproval(tokenAdrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
        Fin4TokenStrut(tokenAdrToReceiveProof).name(), ", claim #", uint2str(claimId),
        ": The time between your previous claim and this one is shorter than the minimum required timespan of ",
        uint2str(minimumInterval / 1000), "s."));
        Fin4MainStrut(Fin4Main).addMessage(uint(messageType), msg.sender, msg.sender, message, address(this));
      }
      return true;
    }

    function minimumIntervalRequirementMet(address tokenAddressUsingThisProofType, address claimer, uint claimId) private view returns(bool) {
      uint timeBetween = Fin4TokenStrut(tokenAddressUsingThisProofType).getTimeBetweenThisClaimAndThatClaimersPreviousOne(claimer, claimId);
      return timeBetween >= minimumInterval;
    }

    // @Override
    function getSubmitProofMethodArgsCount() public view returns(uint) {
      return 2;
    }

    uint public minimumInterval = 0; // in ms

    function setMinimumInterval(address tokenAddressUsingThisProofType, uint _minimumInterval) public returns(bool) {
        require(fin4TokenToItsCreator[tokenAddressUsingThisProofType] == msg.sender, "Only the action type creator can set this value.");
        minimumInterval = _minimumInterval;
        return true;
    }

}
