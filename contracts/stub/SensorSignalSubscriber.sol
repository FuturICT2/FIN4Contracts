pragma solidity ^0.5.17;

contract SensorSignalSubscriber { // used as interface TODO naming-scheme? stub vs. interface...

    function sensorSignalReceived(string memory sensorID, uint timestamp, string memory data) public;

}
