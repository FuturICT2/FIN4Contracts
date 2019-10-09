pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract Password is Fin4BaseProofType {

  constructor(address Fin4MainAddress)
    Fin4BaseProofType(Fin4MainAddress)
    public {
      name = "Password";
      description = "A numeric password (PIN), which the token creator set, needs to be provided.";
      // _password = 1234;
    }

    // TODO support string parameters to be able to use a string-password here
    function submitProof_Password(address tokenAdrToReceiveProof, uint claimId, uint password) public returns(bool) {
      //if (keccak256(abi.encodePacked((_password))) == keccak256(abi.encodePacked((password)))) { // via https://ethereum.stackexchange.com/a/30914
      if (password == _getPassword(tokenAdrToReceiveProof)) {
        _sendApproval(address(this), tokenAdrToReceiveProof, claimId);
      } else {
        string memory message = string(abi.encodePacked(
          Fin4TokenStub(tokenAdrToReceiveProof).name(),
          ": The password you provided is not matching the one set by the action type creator."
        ));
        Fin4Messages(_Fin4MessagesAddr()).addMessage(address(this), msg.sender, message);
      }
      return true;
    }

    // @Override
    function getParameterForActionTypeCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:password:numeric PIN";
    }

    function _getPassword(address token) private view returns(uint) {
      return fin4TokenToParametersSetOnThisProofType[token][0]; // TODO this must not be visible to someone using truffle console or similar!
    }

}
