pragma solidity ^0.5.0;

import 'contracts/stub/Fin4BaseProofTypeStub.sol';

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
    bool hasBeenActedUpon;
    string attachment;
  }

  mapping (address => Message[]) public messages;

  function addMessage(uint messageType, address sender, address receiver,
    string memory message, address fulfillmentAddress, string memory attachment) public returns(uint) {
    Message memory m = Message(messageType, sender, receiver, message, fulfillmentAddress, false, attachment);
    messages[receiver].push(m);
    return messages[receiver].length - 1;
  }

  function getMyMessagesCount() public view returns(uint) {
    return messages[msg.sender].length;
  }

  // have to get messages one by one because returning string arrays is not possible
  function getMyMessage(uint index) public view returns(uint, address, string memory, address, string memory, bool, string memory) {
    Message memory m = messages[msg.sender][index];
    return (m.messageType, m.sender, m.message, m.fulfillmentAddress,
      Fin4BaseProofTypeStub(m.fulfillmentAddress).getName(), m.hasBeenActedUpon, m.attachment);
  }

  // after a picture is approved for instance, the message doesn't need to be shown to the approver anymore
  function markMessageAsActedUpon(address approver, uint messageId) public {
    messages[approver][messageId].hasBeenActedUpon = true;
  }

}
