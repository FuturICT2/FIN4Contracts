pragma solidity ^0.5.0;

import 'contracts/stub/SensorSignalSubscriber.sol';

contract Fin4OracleHub {

    mapping (string => address[]) public sensorIDtoSubscribers;

    // msg.sender is the oracle: our Fin4OracleEngine server or later sensors that talk directly to smart contracts
    function receiveSensorSignal(string memory sensorID, uint timestamp, string memory data) public {
        // require(registeredOracles(msg.sender) ... #ConceptualDecision
        for (uint i = 0; i < sensorIDtoSubscribers[sensorID].length; i++) {
            SensorSignalSubscriber(sensorIDtoSubscribers[sensorID][i]).sensorSignalReceived(sensorID, timestamp, data);
        }
    }

    function subscribeToSensorSignals(address verifierType, string memory sensorID) public {
        sensorIDtoSubscribers[sensorID].push(verifierType);
    }

}
