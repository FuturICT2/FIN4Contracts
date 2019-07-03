pragma solidity ^0.5.0;

import "contracts/Fin4TokenStrut.sol";
import 'contracts/Fin4MainStrut.sol';

contract Fin4BaseProofType {

  string public name;
  string public description;
  address public Fin4Main;

  enum MessageType { APPROVAL, INFO }
  MessageType public messageType;

  mapping (address => address) public fin4TokenToItsCreator; // at the same time a register of Fin4Tokens using this proof type

  constructor(address Fin4MainAddress) public {
    Fin4Main = Fin4MainAddress;
  }

  function getName() public view returns(string memory) {
    return name;
  }

  function getDescription() public view returns(string memory) {
    return description;
  }

  function getInfo() public view returns(string memory, string memory) {
    return (name, description);
  }

  function getSubmitProofMethodArgsCount() public view returns(uint);

  function _sendApproval(address tokenAdrToReceiveProof, uint claimId) internal returns(bool) {
    // private ensures it can only be called from within this SC?
    Fin4TokenStrut(tokenAdrToReceiveProof).receiveProofApproval(msg.sender, claimId);
    return true;
  }

  function registerTokenCreator(address tokenCreator) public returns(bool) {
    fin4TokenToItsCreator[msg.sender] = tokenCreator;
    return true;
  }

  function getCreatorOfToken(address tokenAddress) public view returns(address) {
    return fin4TokenToItsCreator[tokenAddress];
  }

}
