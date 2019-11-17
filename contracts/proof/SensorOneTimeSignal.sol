pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4OracleHub.sol";

contract SensorOneTimeSignal is Fin4BaseProofType {

    constructor(address Fin4MessagingAddress)
        Fin4BaseProofType(Fin4MessagingAddress)
        public {
            name = "SensorOneTimeSignal";
            description = "Approval via a sensor that sends a signal. The token creator specifies the sensor via its ID.";
        }

    address public Fin4OracleHubAddress;

    function setFin4OracleHubAddress(address _Fin4OracleHubAddress) public {
        Fin4OracleHubAddress = _Fin4OracleHubAddress;
    }

    function submitProof(address tokenAddrToReceiveProof, uint claimId) public {

        // TODO
        // _sendApproval(address(this), tokenAddrToReceiveProof, claimId);

        // Rejection makes no sense? Only a timeout maybe? Or token creator can turn it off?
        // Taking the sensor offline as action could trigger that... #ConceptualDecision
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "string:Sensor ID:ID of the approving sensor";
    }

    mapping (address => string) public tokenToSensorID;

    function setParameters(address token, string memory sensorID) public {
        tokenToSensorID[token] = sensorID;
    }

    function _getSensorID(address token) private view returns(string memory) {
        return tokenToSensorID[token];
    }
}
