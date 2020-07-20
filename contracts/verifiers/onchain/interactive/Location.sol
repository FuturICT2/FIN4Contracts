pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/util/Trigonometry.sol";
import "contracts/util/strings.sol";

contract Location is Fin4BaseVerifierType {
    using strings for *;

    // Trigonemtric functions
    function cosineAdjusted(int256 degree) private pure returns (int256) {
        int cosine = Trigonometry.cos(uint16(rtres(900000, 0, degree, 4096, 0)));
        return rtres(32767, -32767, cosine, 10000, -10000);
    }
    // rule of three
    function rtres(int256 _max1, int256 _min1, int256 _value, int256 _max2, int256 _min2) private pure returns (int256) {
        assert(_max1 > _min1);
        assert(_max2 > _min2);
        int256 max1 = _max1 - _min1;
        int256 max2 = _max2 - _min2;
        int256 value = _value - _min1;
        int256 retorno = (value * max2 ) / max1;
        return retorno + _min2;
    }
    // https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method
    function sqrt(uint x) private pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
    /*
    Conversion helper functions
    */
    //Converts degrees in radiands
    function toRadiands(int256 degree) private pure returns (int256) {
        int256 PI = 31415;
        int256 radiands = degree * (PI / 180 ) / 10000;
        return radiands;
    }

    // https://jonisalonen.com/2014/computing-distance-between-coordinates-can-be-simple-and-fast/
    function calculateDistance(int256 lat0, int256 lon0, int256 lat1, int256 lon1) public view returns(uint) {
        //converts to radiands
        int256 _lat1 = toRadiands(lat0);
        int256 _lat2 = toRadiands(lat1);
        int256 _log1 = toRadiands(lon0);
        int256 _log2 = toRadiands(lon1);
        int256 x = (_log2 - _log1 ) * cosineAdjusted((lat1 + lat0)/2)/10000;
        int256 y = _lat2 - _lat1;
        return sqrt(uint256((x * x) + (y * y))) * 63710000/10000;
    }

    constructor() public {
        name = "Location";
        description = "A location, which is within a radius of a location the token creator defines, needs to be provided.";
    }

    // (Deprecated) Function that assumes location is calculated in front end
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

    // Calculates distance on chain using a cheap approximation algorithm
    function submitProof_Location_Server(address tokenAddrToReceiveVerifierNotice, uint claimId, int256 lat1, int256 lon1) public {
        uint distanceToLocation = calculateDistance(lat0[tokenAddrToReceiveVerifierNotice],lon0[tokenAddrToReceiveVerifierNotice], lat1, lon1);
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

    function locationIsWithinMaxDistToSpecifiedLocation(address token, uint distanceToLocation) public view returns(bool) {
        return distanceToLocation <= _getMaxDistance(token);
    }

    mapping (address => uint) public tokenToMaxDistParameter;
    mapping (address => string) public tokenToLatLonStrParameter;
    mapping (address => int256) public lat0;
    mapping (address => int256) public lon0;

    // Sets information during Token Creation
    function setParameters(address token, string memory latLonString, uint maxDistance) public {
        tokenToLatLonStrParameter[token] = latLonString;
        tokenToMaxDistParameter[token] = maxDistance;
        strings.slice memory s = latLonString.toSlice();
        lat0[token] = convertStringToInt(s.split(strings.toSlice("/")).toString());
        lon0[token] = convertStringToInt(s.toString());
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

    function convertStringToInt(string memory stringValue) private returns (int) {
        bytes memory byteValue = convertStringToBytes(stringValue);

        int result = 0;
        uint start = 0;
        int phase = 1;

        for (uint i = 0; i < byteValue.length; i++) {
            if ((byteValue[i] < byte("0") || byteValue[i] > byte("9")) && (byteValue[i] != byte("+") && byteValue[i] != byte("-"))) {
                return 0;
            }
        }

        if (byteValue[0] == byte("-")) {
            phase = -1;
            start = 1;
        } else if (byteValue[0] == byte("+")) {
            start = 1;
        }

        for(uint j = start; j < byteValue.length ; j++) {
            result += (uint8(byteValue[j]) - 48) * int(10 ** (byteValue.length - (j + 1)));
        }

        result *= phase;
        return result;
    }

    function convertStringToBytes(string memory str) private returns (bytes memory) {
        return bytes(str);
    }
}
