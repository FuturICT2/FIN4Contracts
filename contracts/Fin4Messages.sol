pragma solidity ^0.5.0;

contract Fin4Messages {

  constructor() public {
    // Fin4Main = Fin4MainAddress;
  }

  struct Message {
    uint messageType; // is an Enum in Fin4BaseProofType
    address sender;
    address receiver;
    string message;
    address fulfillmentAddress; // where to go and do something
  }

  mapping (address => Message[]) public messages;

  function addMessage(uint messageType, address sender, address receiver,
    string memory message, address fulfillmentAddress) public returns(bool) {
    Message memory m = Message(messageType, sender, receiver, message, fulfillmentAddress);
    messages[receiver].push(m);
    return true;
  }

  function getMyMessagesCount(address sender) public view returns(uint) {
    return messages[sender].length;
  }

  function getMyMessage(address sender, uint index) public view returns(uint, address, string memory, address, string memory) {
    Message memory m = messages[sender][index];
    return (m.messageType, m.sender, m.message, m.fulfillmentAddress, "TODO");
  }

}
