pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Location is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "Location";
      description = "A location, which is within a radius of a location the token creator defines, needs to be provided.";
      messageType = MessageType.INFO;
      _Latitude = 0;
      _Longitude = 0;
      maxDistance = 10; // km
    }

    uint public _Latitude; // TODO float?
    uint public _Longitude;
    uint public maxDistance;

    function submitProof(address tokenAdrToReceiveProof, uint claimId, uint latitude, uint longitude) public returns(bool) {
      if (locationIsWithinMaxDistToSpecifiedLocation(latitude, longitude)) {
        _sendApproval(tokenAdrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
        Fin4TokenStrut(tokenAdrToReceiveProof).name(),
        ": Your location is not within the allowed distance to the defined location."));
        Fin4Messages(_Fin4MessagesAddr()).addMessage(uint(messageType), msg.sender, msg.sender, message, address(this));
      }
      return true;
    }

    function locationIsWithinMaxDistToSpecifiedLocation(uint latitude, uint longitude) public view returns(bool) {
        // TODO
        return false;
    }

    // @Override
    function getSubmitProofMethodArgsCount() public view returns(uint) {
      return 4;
    }

    // @Override
    function getParameterForActionTypeCreatorToSetEncoded() public view returns(string memory) {
      return "uint:latitude:m,uint:longitude:m,uint:maxDistance:m";
    }

}
