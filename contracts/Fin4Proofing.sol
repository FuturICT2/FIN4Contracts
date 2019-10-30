pragma solidity ^0.5.0;

import 'contracts/proof/Fin4BaseProofType.sol';

contract Fin4Proofing {

    // all the proof types that token creators can use
    address[] public proofTypes;

    function addProofType(address proofType) public returns(bool) {
        proofTypes.push(proofType);
        return true;
    }

    function getProofTypes() public view returns(address[] memory) {
        return proofTypes;
    }

    function getProofTypeInfo(address proofType) public view returns(string memory, string memory, string memory) {
        // require(proofTypeIsRegistered(proofType), "Address is not registered as proof type");
        return Fin4BaseProofType(proofType).getInfo();
    }

    // called from Fin4Token instances to ensure the required proof types there are a subset of the proofTypes here
    function proofTypeIsRegistered(address proofTypeToCheck) public view returns(bool) {
        for (uint i = 0; i < proofTypes.length; i++) {
            if (proofTypes[i] == proofTypeToCheck) {
                return true;
            }
        }
        return false;
    }

}
