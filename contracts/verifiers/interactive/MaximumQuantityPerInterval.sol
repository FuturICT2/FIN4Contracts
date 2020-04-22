pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";

contract MaximumQuantityPerInterval is Fin4BaseVerifierType {

   constructor() public  {
      name = "MaximumQuantityPerInterval";
      description = "Defines the maximum quantity a user can claim within a specified time interval.";
      // interval = 1 * 24 * 60 * 60 * 1000; // 1 day
      // maxQuantity = 10;
    }

    function submitProof_MaximumQuantityPerInterval(address tokenAddrToReceiveVerifierNotice, uint claimId) public {
      if (requirementMet(tokenAddrToReceiveVerifierNotice, msg.sender, claimId)) {
        _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "");
      } else {
        string memory message = string(abi.encodePacked(
          Fin4TokenStub(tokenAddrToReceiveVerifierNotice).name(),
          ": The quantity you are claiming would take you beyond the allowed amount for the given interval. Interval: ",
          uint2str(_getInterval(tokenAddrToReceiveVerifierNotice) / 1000), "s, max. quantity: ",
          uint2str(_getMaxQuantity(tokenAddrToReceiveVerifierNotice)), "."
        ));
        _sendRejectionNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, message);
      }
    }

    function requirementMet(address tokenAddressUsingThisverifierType, address claimer, uint claimId) private view returns(bool) {
      /*
      uint sum;
      uint requestedQuantity;
      (sum, requestedQuantity) = Fin4TokenStub(tokenAddressUsingThisverifierType)
        .sumUpQuantitiesWithinIntervalBeforeThisClaim(claimer, claimId, _getInterval(tokenAddressUsingThisverifierType));
      return sum + requestedQuantity <= _getMaxQuantity(tokenAddressUsingThisverifierType);
      */
      return true; // TODO
    }

    /* // Archived here from Fin4TokenBase
    function sumUpQuantitiesWithinIntervalBeforeThisClaim(address claimer, uint claimId, uint interval) public view returns(uint, uint) {
      uint[] memory ids = getClaimIds(claimer);
      if (ids.length < 2 || ids[0] == claimId) {
        return (0, claims[claimId].quantity);
      }

      uint dateOfRequestingClaim = claims[claimId].claimCreationTime; // TODO check if that's actually the claimers claim
      uint sum = 0;

      for (uint i = 0; i < ids.length; i ++) {
        if (ids[i] != claimId && dateOfRequestingClaim - claims[ids[i]].claimCreationTime <= interval) {
          sum = sum + claims[ids[i]].quantity;
        }
      }

      return (sum, claims[claimId].quantity);
    }
    */

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:interval:days,uint:maxQuantity:quantity";
    }

    mapping (address => uint[]) public tokenToParameters;

    function setParameters(address token, uint interval, uint maxQuantity) public {
      tokenToParameters[token] = [interval, maxQuantity];
    }

    /*
    function getParameterizedDescription(address token) public view returns(string memory) {
      return string(abi.encodePacked(
          "The token creator defined a maximum quantity of ",
          uint2str(_getMaxQuantity(token)),
          " to be claimable in an interval of ",
          uint2str(_getInterval(token) / (1000 * 60 * 60 * 24)), " days."
        ));
    }*/

    function _getInterval(address token) private view returns(uint) {
      return tokenToParameters[token][0] * 24 * 60 * 60 * 1000; // from days to miliseconds
    }

    function _getMaxQuantity(address token) private view returns(uint) {
      return tokenToParameters[token][1];
    }
}
