pragma solidity ^0.5.0;

import 'contracts/stub/Fin4BaseProofTypeStub.sol';

contract Fin4Messages {

  event NewMessage(address receiver, uint messageId);

  enum MessageType { INFO, APPROVAL, USER2USER } // diferent types of message types, determine how they get rendered in the front end

  struct Message {
    uint messageId;
    uint messageType; // is an Enum in Fin4BaseProofType
    address sender;
    string senderStr;
    address receiver;
    string message;
    bool hasBeenActedUpon;
    string attachment;
    uint pendingApprovalId;
  }

  mapping (address => Message[]) public messages;

  function addMessage(uint messageType, address sender, address receiver, string memory message)
    private returns (Message memory messageObj) {
    Message memory m;
    m.messageType = messageType;
    m.sender = sender;
    m.receiver = receiver;
    m.message = message;
    m.messageId = messages[receiver].length;
    messages[receiver].push(m);
    return m;
  }

  function addUserMessage(address receiver, string memory message) public returns(uint) {
    Message memory m = addMessage(uint(MessageType.USER2USER), msg.sender, receiver, message);
    emit NewMessage(receiver, m.messageId);
  }

  function addInfoMessage(address sender, address receiver, string memory message) public returns(uint) {
    Message memory m = addMessage(uint(MessageType.INFO), sender, receiver, message);
    emit NewMessage(receiver, m.messageId);
    return m.messageId;
  }

  function addPendingApprovalMessage(address sender, string memory senderStr, address receiver, string memory message,
    string memory attachment, uint pendingApprovalId) public returns(uint) {
    Message memory m = addMessage(uint(MessageType.APPROVAL), sender, receiver, message);
    m.senderStr = senderStr;
    m.hasBeenActedUpon = false;
    m.attachment = attachment;
    m.pendingApprovalId = pendingApprovalId;
    emit NewMessage(receiver, m.messageId);
    return m.messageId;
  }

  function getMyMessagesCount() public view returns(uint) {
    return messages[msg.sender].length;
  }

  // have to get messages one by one because returning string arrays is not possible
  function getMyMessage(uint index) public view returns(uint, uint, address, string memory, string memory, bool, string memory, uint) {
    Message memory m = messages[msg.sender][index];
    return (m.messageId, m.messageType, m.sender, m.senderStr, m.message, m.hasBeenActedUpon, m.attachment, m.pendingApprovalId);
  }

  // after a picture is approved for instance, the message doesn't need to be shown to the approver anymore
  function markMessageAsActedUpon(address approver, uint messageId) public {
    messages[approver][messageId].hasBeenActedUpon = true;
  }

}
