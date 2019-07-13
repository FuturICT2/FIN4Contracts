pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Location is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "Location";
      description = "A location, which is within a radius of a location the token creator defines, needs to be provided.";
      messageType = MessageType.INFO;
    }

    function submitProof(address tokenAdrToReceiveProof, uint claimId,
      uint latitude, uint longitude, uint distanceToLocation) public returns(bool) {
      if (locationIsWithinMaxDistToSpecifiedLocation(tokenAdrToReceiveProof, distanceToLocation)) {
        _sendApproval(tokenAdrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
        Fin4TokenStrut(tokenAdrToReceiveProof).name(),
        ": Your location is not within the allowed distance to the defined location."));
        Fin4Messages(_Fin4MessagesAddr()).addMessage(uint(messageType), msg.sender, msg.sender, message, address(this), "");
      }
      return true;
    }

    function locationIsWithinMaxDistToSpecifiedLocation(address token, uint distanceToLocation) public view returns(bool) {
        return distanceToLocation <= _getMaxDistance(token);
    }

    // @Override
    function getSubmitProofMethodArgsCount() public view returns(uint) {
      return 5;
    }

    // @Override
    function getParameterForActionTypeCreatorToSetEncoded() public view returns(string memory) {
      return "uint:latitude:gps,uint:longitude:gps,uint:maxDistance:m";
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
