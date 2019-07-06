pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Password is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "Password";
      description = "To be approved automatically, the user needs to provide a password that the token creator sets once";
      _password = "test123";
      messageType = MessageType.INFO;
    }

    string public _password;

    function submitProof(address tokenAdrToReceiveProof, uint claimId, string memory password) public returns(bool) {
      // via https://ethereum.stackexchange.com/a/30914
      if (keccak256(abi.encodePacked((_password))) == keccak256(abi.encodePacked((password)))) {
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

}
