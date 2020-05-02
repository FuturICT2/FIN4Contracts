pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";

contract Location is Fin4BaseVerifierType {

    constructor() public  {
        name = "Location";
        description = "A location, which is within a radius of a location the token creator defines, needs to be provided.";
    }

    function submitProof_Location(address tokenAddrToReceiveVerifierNotice, uint claimId, uint distanceToLocation) public {
        if (locationIsWithinMaxDistToSpecifiedLocation(tokenAddrToReceiveVerifierNotice, distanceToLocation)) {
            _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "");
        } else {
            string memory message = string(abi.encodePacked(
                "Your claim on token '",
                Fin4TokenStub(tokenAddrToReceiveVerifierNotice).name(),
                "' got rejected from verifier type 'Location' because",
                " your location is not within a circle the token creator defined."));
            _sendRejectionNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, message);
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
