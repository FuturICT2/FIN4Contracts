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

pragma solidity ^0.5.17;

contract Fin4Main {

    address public Fin4MainCreator;
    constructor() public {
        Fin4MainCreator = msg.sender;
    }

    address public Fin4UncappedTokenCreatorAddress;
    address public Fin4CappedTokenCreatorAddress;
    address public Fin4TokenManagementAddress;
    address public Fin4ClaimingAddress;
    address public Fin4CollectionsAddress;
    address public Fin4MessagingAddress;
    address public Fin4VerifyingAddress;
    address public Fin4GroupsAddress;
    address public Fin4SystemParametersAddress;

    function setSatelliteAddresses(address uncappedTokenCreator, address cappedTokenCreator, address tokenManagement, address claiming,
    address collections, address messaging, address verifying, address groups, address systemParameters) public {
        // TODO use TCR instead of giving this right only to the creator of Fin4Main? #ConceptualDecision
        require (msg.sender == Fin4MainCreator, "Only the creator of Fin4Main can set satellite addresses");
        Fin4UncappedTokenCreatorAddress = uncappedTokenCreator;
        Fin4CappedTokenCreatorAddress = cappedTokenCreator;
        Fin4TokenManagementAddress = tokenManagement;
        Fin4ClaimingAddress = claiming;
        Fin4CollectionsAddress = collections;
        Fin4MessagingAddress = messaging;
        Fin4VerifyingAddress = verifying;
        Fin4GroupsAddress = groups;
        Fin4SystemParametersAddress = systemParameters;
    }

    function getSatelliteAddresses() public view returns(address, address, address, address, address, address, address, address, address) {
        return (Fin4UncappedTokenCreatorAddress, Fin4CappedTokenCreatorAddress, Fin4TokenManagementAddress, Fin4ClaimingAddress,
            Fin4CollectionsAddress, Fin4MessagingAddress, Fin4VerifyingAddress, Fin4GroupsAddress, Fin4SystemParametersAddress);
    }

    address public REPToken;
    address public GOVToken;
    address public Registry;
    address public PLCRVoting;
    address public Parameterizer;

    function setTCRaddresses(address _REPToken, address _GOVToken, address _Registry, address _PLCRVoting, address _Parameterizer) public {
        REPToken = _REPToken;
        GOVToken = _GOVToken;
        Registry = _Registry;
        PLCRVoting = _PLCRVoting;
        Parameterizer = _Parameterizer;
    }

    function getTCRaddresses() public view returns(address, address, address, address, address) {
        return (REPToken, GOVToken, Registry, PLCRVoting, Parameterizer);
    }

    // FOR DEV

    uint public foo = 3;

    function dev(uint numb) public {
        require(numb == foo, "numb is not foo");
    }

}
