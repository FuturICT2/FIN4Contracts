pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract LocationAtProofSubmission is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "LocationAtProofSubmission";
      description = "To be approved automatically, the user needs to provide location data (latitude/longitude) that is within a radius of a location the token creator defines";
      messageType = MessageType.INFO;
      _Latitude = 0;
      _Longitude = 0;
      maxDistance = 10; // km
    }

    uint public _Latitude; // TODO float?
    uint public _Longitude;
    uint public maxDistance;

    function submitProof(address tokenAdrToReceiveProof, uint claimId, uint Latitude, uint Longitude) public returns(bool) {
      if (locationIsWithinMaxDistToSpecifiedLocation(Latitude, Longitude)) {
        _sendApproval(tokenAdrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
        Fin4TokenStrut(tokenAdrToReceiveProof).name(), ", claim #", uint2str(claimId),
        ": Your location is not within the allowed distance to the defined location"));
        Fin4MainStrut(Fin4Main).addMessage(uint(messageType), msg.sender, msg.sender, message, address(this));
      }
      return true;
    }

    function locationIsWithinMaxDistToSpecifiedLocation(uint Latitude, uint Longitude) public view returns(bool) {
        // TODO
        return false;
    }

    // @Override
    function getSubmitProofMethodArgsCount() public view returns(uint) {
      return 4;
    }

}
