/*
Copyright (C) 2018-2019 Chair of Computational Social Science, ETH Zürich <http://coss.ethz.ch>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

pragma solidity ^0.5.0;

import 'contracts/proof/Fin4BaseProofType.sol';

contract Fin4Main {

  address public Fin4MainCreator;
  constructor() public {
      Fin4MainCreator = msg.sender;
  }

  // ------------------------- SATELLITE CONTRACTS -------------------------

  address public Fin4TokenManagementAddress;
  address public Fin4ClaimingAddress;
  address public Fin4CollectionsAddress;
  address public Fin4MessagesAddress;

  function setSatelliteAddresses(address tokenManagement, address claiming, address collections, address messages) public {
    // TODO use TCR instead of giving this right only to the creator of Fin4Main? #ConceptualDecision
    require (msg.sender == Fin4MainCreator, "Only the creator of Fin4Main can set satellite addresses");
    Fin4TokenManagementAddress = tokenManagement;
    Fin4ClaimingAddress = claiming;
    Fin4CollectionsAddress = collections;
    Fin4MessagesAddress = messages;
  }

  function getSatelliteAddresses() public view returns(address, address, address, address) {
    return (Fin4TokenManagementAddress, Fin4ClaimingAddress, Fin4CollectionsAddress, Fin4MessagesAddress);
  }

  // ------------------------- PROOF TYPES -------------------------

  // all the proof types that action type creators can use
  address[] public proofTypes;

  function addProofType(address proofType) public returns(bool) {
    proofTypes.push(proofType);
    return true;
  }

  function getProofTypes() public view returns(address[] memory) {
    return proofTypes;
  }

  function getProofTypeInfo(address proofType) public view returns(string memory, string memory, string memory) {
    // require(proofTypeIsRegistered(proofType), "Address is not registered as proof type on Fin4Main");
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

// ------------------------- REP, GOV and TCR addresses -------------------------

  /*
  address public REPToken;
  address public GOVToken;
  address public Registry;
  address public PLCRVoting;

  function setTCRaddresses(address _REPToken, address _GOVToken, address _Registry, address _PLCRVoting) public {
    REPToken = _REPToken;
    GOVToken = _GOVToken;
    Registry = _Registry;
    PLCRVoting = _PLCRVoting;
  }

  function getTCRaddresses() public view returns(address, address, address, address) {
    return (REPToken, GOVToken, Registry, PLCRVoting);
  }
  */

}
