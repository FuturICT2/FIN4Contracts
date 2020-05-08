pragma solidity ^0.5.17;

contract UnderlyingParameterizedInterface {

    // format: "type:name:description,type:name:description"
    // will be displayed as "name (description)" in the respective frontend input fields
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory);

    // implementing classes must also have this function:
    // function setParameters() public;
    // the arguments vary though based on what is encoded in getParameterForTokenCreatorToSetEncoded()

}
