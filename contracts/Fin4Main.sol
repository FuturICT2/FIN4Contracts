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

  // ------------------------- FIN4TOKENS -------------------------

  address public Fin4TokenManagementAddress;

  function setFin4TokenManagementAddress(address addr) public {
    Fin4TokenManagementAddress = addr;
  }

  function getFin4TokenManagementAddress() public view returns(address) {
    return Fin4TokenManagementAddress;
  }

  // ------------------------- CLAIMING -------------------------

  address public Fin4ClaimingAddress;

  function setFin4ClaimingAddress(address addr) public {
    Fin4ClaimingAddress = addr;
  }

  function getFin4ClaimingAddress() public view returns(address) {
    return Fin4ClaimingAddress;
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

  // ------------------------- MESSAGES -------------------------

  // contract handling messages to the user is outsourced
  address public Fin4MessagesAddr;

  function setFin4MessagesAddress(address addr) public {
    Fin4MessagesAddr = addr;
  }

  function getFin4MessagesAddress() public view returns(address) {
    return Fin4MessagesAddr;
  }

  // ------------------------- COLLECTIONS -------------------------

  address public Fin4CollectionsAddr;

  function setFin4CollectionsAddress(address addr) public {
    Fin4CollectionsAddr = addr;
  }

  function getFin4CollectionsAddress() public view returns(address) {
    return Fin4CollectionsAddr;
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
