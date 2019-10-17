pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Location is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "Location";
      description = "A location, which is within a radius of a location the token creator defines, needs to be provided.";
    }

    function submitProof_Location(address tokenAdrToReceiveProof, uint claimId, uint distanceToLocation) public returns(bool) {
      if (locationIsWithinMaxDistToSpecifiedLocation(tokenAdrToReceiveProof, distanceToLocation)) {
        _sendApproval(address(this), tokenAdrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
        Fin4TokenStub(tokenAdrToReceiveProof).name(),
        ": Your location is not within the allowed distance to the defined location."));
        Fin4Messages(_Fin4MessagesAddr()).addInfoMessage(address(this), msg.sender, message);
      }
      return true;
    }

    // TODO calculate distance here instead of trusting the front end?
    // requires an oracle or using floating point math (sin etc.) here though
    function locationIsWithinMaxDistToSpecifiedLocation(address token, uint distanceToLocation) public view returns(bool) {
        return distanceToLocation <= _getMaxDistance(token);
    }

    // @Override
    function getParameterForActionTypeCreatorToSetEncoded() public pure returns(string memory) {
      return "string:latitude / longitude:gps,uint:maxDistance:m";
    }

    function _getLatitude(address token) private view returns(uint) {
      return fin4TokenToParametersSetOnThisProofType[token][0];
    }

    function _getLongitude(address token) private view returns(uint) {
      return fin4TokenToParametersSetOnThisProofType[token][1];
    }

    function _getMaxDistance(address token) private view returns(uint) {
      return fin4TokenToParametersSetOnThisProofType[token][2];
    }

}
