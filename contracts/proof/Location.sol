pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Location is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "Location";
      description = "A location, which is within a radius of a location the token creator defines, needs to be provided.";
      hasParameterForTokenCreatorToSet = true;
    }

    function submitProof_Location(address tokenAddrToReceiveProof, uint claimId, uint distanceToLocation) public {
      if (locationIsWithinMaxDistToSpecifiedLocation(tokenAddrToReceiveProof, distanceToLocation)) {
        _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
             "Your claim on token '",
            Fin4TokenStub(tokenAddrToReceiveProof).name(),
             "' got rejected from proof type 'Location' because",
             " your location is not within a circle the token creator defined."));
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), msg.sender, message);
        _sendRejection(address(this), tokenAddrToReceiveProof, claimId);
      }
    }

    // TODO calculate distance here instead of trusting the front end?
    // requires an oracle or using floating point math (sin etc.) here though #ConceptualDecision
    function locationIsWithinMaxDistToSpecifiedLocation(address token, uint distanceToLocation) public view returns(bool) {
        return distanceToLocation <= _getMaxDistance(token);
    }

    mapping (address => uint) public tokenToMaxDistParameter;
    mapping (address => string) public tokenToLatLonStrParameter;

    function setParameters(address token, string memory latLonString, uint maxDistance) public {
      tokenToLatLonStrParameter[token] = latLonString;
      tokenToMaxDistParameter[token] = maxDistance;
      tellTokenIamNowParameterized(token);
    }

    function getLatitudeLongitudeString(address token) public view returns(string memory) {
      return _getLatLonStr(token);
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
      return "string:latitude / longitude:gps,uint:maxDistance:m";
    }

    function _getLatLonStr(address token) private view returns(string memory) {
      return tokenToLatLonStrParameter[token];
    }

    function _getMaxDistance(address token) private view returns(uint) {
      return tokenToMaxDistParameter[token];
    }

}
