pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Location is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "Location";
      description = "A location, which is within a radius of a location the token creator defines, needs to be provided.";
    }

    function submitProof_Location(address tokenAddrToReceiveProof, uint claimId, uint distanceToLocation) public {
      if (locationIsWithinMaxDistToSpecifiedLocation(tokenAddrToReceiveProof, distanceToLocation)) {
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
        Fin4TokenStub(tokenAddrToReceiveProof).name(),
        ": Your location is not within the allowed distance to the defined location."));
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), msg.sender, message);
      }
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
