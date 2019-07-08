pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Password is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "Password";
      description = "A numeric password (PIN), which the token creator set, needs to be provided";
      _password = 1234;
      messageType = MessageType.INFO;
    }

    uint public _password;

    function submitProof(address tokenAdrToReceiveProof, uint claimId, uint password) public returns(bool) {
      //if (keccak256(abi.encodePacked((_password))) == keccak256(abi.encodePacked((password)))) { // via https://ethereum.stackexchange.com/a/30914
      if (password == _password) {
        _sendApproval(tokenAdrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
        Fin4TokenStrut(tokenAdrToReceiveProof).name(), ", claim #", uint2str(claimId),
        ": The password you provided was not correct"));
        Fin4MainStrut(Fin4Main).addMessage(uint(messageType), msg.sender, msg.sender, message, address(this));
      }
      return true;
    }

    // @Override
    function getSubmitProofMethodArgsCount() public view returns(uint) {
      return 3;
    }

    // @Override
    function getParameterForActionTypeCreatorToSetEncoded() public view returns(string memory) {
      return "uint:password";
    }

    // @Override
    function setParameters(address token, uint[] memory params) public returns(bool) {
      _password = params[0];
    }

}
