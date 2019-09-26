pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract MaximumQuantityPerInterval is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "MaximumQuantityPerInterval";
      description = "Defines the maximum quantity a user can claim within a specified time interval.";
      // interval = 1 * 24 * 60 * 60 * 1000; // 1 day
      // maxQuantity = 10;
      messageType = MessageType.INFO;
    }

    function submitProof_MaximumQuantityPerInterval(address tokenAdrToReceiveProof, uint claimId) public returns(bool) {
      if (requirementMet(tokenAdrToReceiveProof, msg.sender, claimId)) {
        _sendApproval(address(this), tokenAdrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
          Fin4TokenStub(tokenAdrToReceiveProof).name(),
          ": The quantity you are claiming would take you beyond the allowed amount for the given interval. Interval: ",
          uint2str(_getInterval(tokenAdrToReceiveProof) / 1000), "s, max. quantity: ",
          uint2str(_getMaxQuantity(tokenAdrToReceiveProof)), "."
        ));
        Fin4Messages(_Fin4MessagesAddr()).addMessage(uint(messageType), msg.sender, msg.sender, message, address(this), "");
      }
      return true;
    }

    function requirementMet(address tokenAddressUsingThisProofType, address claimer, uint claimId) private view returns(bool) {
      uint sum;
      uint requestedQuantity;
      (sum, requestedQuantity) = Fin4TokenStub(tokenAddressUsingThisProofType)
        .sumUpQuantitiesWithinIntervalBeforeThisClaim(claimer, claimId, _getInterval(tokenAddressUsingThisProofType));
      return sum + requestedQuantity <= _getMaxQuantity(tokenAddressUsingThisProofType);
    }

    // @Override
    function getParameterForActionTypeCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:interval:days,uint:maxQuantity:quantity";
    }

    // @Override
    function getParameterizedDescription(address token) public view returns(string memory) {
      return string(abi.encodePacked(
          "The action type creator defined a maximum quantity of ",
          uint2str(_getMaxQuantity(token)),
          " to be claimable in an interval of ",
          uint2str(_getInterval(token) / (1000 * 60 * 60 * 24)), " days."
        ));
    }

    function _getInterval(address token) private view returns(uint) {
      return fin4TokenToParametersSetOnThisProofType[token][0] * 24 * 60 * 60 * 1000; // from days to miliseconds
    }

    function _getMaxQuantity(address token) private view returns(uint) {
      return fin4TokenToParametersSetOnThisProofType[token][1];
    }
}
