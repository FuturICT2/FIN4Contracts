pragma solidity ^0.5.17;

import "contracts/verifiers/Fin4BaseVerifierType.sol";
import "contracts/Fin4OracleHub.sol";
import "contracts/Fin4TokenBase.sol";
import "contracts/Fin4Messaging.sol";

contract SensorOneTimeSignal is Fin4BaseVerifierType {

     constructor() public  {
        name = "SensorOneTimeSignal";
        description = "Approval via a sensor that sends a signal. The token creator specifies the sensor via its ID.";
    }

    address public Fin4OracleHubAddress;
    address public Fin4MessagingAddress;

    function setFin4OracleHubAddress(address _Fin4OracleHubAddress) public {
        Fin4OracleHubAddress = _Fin4OracleHubAddress;
    }

    function setFin4MessagingAddress(address Fin4MessagingAddr) public {
        Fin4MessagingAddress = Fin4MessagingAddr;
    }
    // Function called to provide sensor data, It calls submitProofViaSensor automatically
    function sensorSignalReceived(string memory sensorID, uint timestamp, string memory data) public {
        /* // TODO reactivate
        for (uint i = 0; i < sensorIDtoTokens[sensorID].length; i ++) {
            address token = sensorIDtoTokens[sensorID][i];
            uint[] memory claimIDs;
            address[] memory claimers;
            (claimIDs, claimers) = Fin4TokenBase(token).getUnrejectedClaimsWithThisVerifierTypeUnapproved(address(this));
            for (uint j = 0; j < claimIDs.length; j ++) {
                string memory message = string(abi.encodePacked(
                    "Your claim on token '", Fin4TokenStub(token).name(), "' got approved from sensor '",
                    sensorID, "' via verifier type 'SensorOneTimeSignal' at timestamp ",
                    uint2str(timestamp), ". Message from sensor: ", data));
                submitProofViaSensor(token, claimIDs[j], claimers[j], message);
            }
        }
        */
    }

    /* // Archived here from Fin4TokenBase
    function getUnrejectedClaimsWithThisVerifierTypeUnapproved(address verifierType) public view returns(uint[] memory, address[] memory) {
        uint count = 0;
        for (uint i = 0; i < nextClaimId; i ++) {
            if (!claims[i].gotRejected && verifierTypeIsRequired(verifierType, i) && !claims[i].verifierStatuses[verifierType]) {
                count ++;
            }
        }
        uint[] memory claimIDs = new uint[](count);
        address[] memory claimers = new address[](count);
        count = 0;
        for (uint i = 0; i < nextClaimId; i ++) {
            if (!claims[i].gotRejected && verifierTypeIsRequired(verifierType, i) && !claims[i].verifierStatuses[verifierType]) {
                claimIDs[count] = i;
                claimers[count] = claims[i].claimer;
                count ++;
            }
        }
        return (claimIDs, claimers);
    }
    */

    function submitProofViaSensor(address tokenAddrToReceiveVerifierNotice, uint claimId, address claimer, string memory message) public {
        // TODO build message here? Requires all the arguments to be shifted around...
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), claimer, message);
        _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "");
        // Rejection makes no sense? Only a timeout maybe? Or token creator can turn it off?
        // Taking the sensor offline as action could trigger that... #ConceptualDecision
    }

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
        return "string:Sensor ID:ID of the approving sensor";
    }

    mapping (address => string) public tokenToSensorID;
    mapping (string => address[]) public sensorIDtoTokens;

    function setParameters(address token, string memory sensorID) public {
        tokenToSensorID[token] = sensorID;
        sensorIDtoTokens[sensorID].push(token);
        Fin4OracleHub(Fin4OracleHubAddress).subscribeToSensorSignals(address(this), sensorID);
    }

    function _getSensorID(address token) private view returns(string memory) {
        return tokenToSensorID[token];
    }
}
