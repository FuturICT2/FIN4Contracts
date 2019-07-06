pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract MaximumQuantityPerInterval is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "MaximumQuantityPerInterval";
      description = "Defines the maximum quantity a user can claim within a specified time interval";
      interval = 1 * 24 * 60 * 60 * 1000; // 1 day
      maxQuantity = 10;
      messageType = MessageType.INFO;
    }

    function submitProof(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
      if (requirementMet(tokenAdrToReceiveProof, msg.sender, claimId)) {
        _sendApproval(tokenAdrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
        Fin4TokenStrut(tokenAdrToReceiveProof).name(), ", claim #", uint2str(claimId),
        ": The quantity you are claiming would take you beyond the allowed amount for the given interval. Interval: ",
        uint2str(interval / 1000), "s, max. quantity: ", uint2str(maxQuantity)));
        Fin4MainStrut(Fin4Main).addMessage(uint(messageType), msg.sender, msg.sender, message, address(this));
      }
      return true;
    }

    function requirementMet(address tokenAddressUsingThisProofType, address claimer, uint claimId) private view returns(bool) {
      uint sum;
      uint requestedQuantity;
      (sum, requestedQuantity) = Fin4TokenStrut(tokenAddressUsingThisProofType)
        .sumUpQuantitiesWithinIntervalBeforeThisClaim(claimer, claimId, interval);
      return sum + requestedQuantity <= maxQuantity;
    }

    // @Override
    function getSubmitProofMethodArgsCount() public view returns(uint) {
      return 2;
    }

    uint public interval = 0; // in ms
    uint public maxQuantity = 0;

}
