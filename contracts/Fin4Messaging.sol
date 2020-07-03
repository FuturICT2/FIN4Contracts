pragma solidity ^0.5.17;

import 'contracts/stub/Fin4BaseVerifierTypeStub.sol';

contract Fin4Messaging {

    event NewMessage(address receiver, uint messageId);
    event MessageMarkedAsRead(address receiver, uint messageId);

    enum MessageType { INFO, APPROVAL, USER2USER } // diferent types of message types, determine how they get rendered in the front end

    struct Message {
        uint messageId;
        uint messageType; // is an Enum in Fin4BaseVerifierType
        address sender;
        string senderStr;
        address receiver;
        string message;
        bool hasBeenActedUpon;
        string attachment;
        uint pendingRequestId;
    }

    mapping (address => Message[]) public messages;

    function addMessage(uint messageType, address sender, address receiver, string memory message)
        private returns (uint) {
        Message memory m;
        m.messageType = messageType;
        m.sender = sender;
        m.receiver = receiver;
        m.message = message;
        m.messageId = messages[receiver].length;
        messages[receiver].push(m);
        return m.messageId;
    }

    function addUserMessage(address receiver, string memory message) public returns(uint) {
        uint messageId = addMessage(uint(MessageType.USER2USER), msg.sender, receiver, message);
        emit NewMessage(receiver, messageId);
    }

    function addInfoMessage(address sender, address receiver, string memory message) public returns(uint) {
        uint messageId = addMessage(uint(MessageType.INFO), sender, receiver, message);
        emit NewMessage(receiver, messageId);
        return messageId;
    }

    function addPendingRequestMessage(address sender, string memory senderStr, address receiver, string memory message,
        string memory attachment, uint pendingRequestId) public returns(uint) {
        uint messageId = addMessage(uint(MessageType.APPROVAL), sender, receiver, message);
        Message storage m = messages[receiver][messageId];
        m.senderStr = senderStr;
        m.hasBeenActedUpon = false;
        m.attachment = attachment;
        m.pendingRequestId = pendingRequestId;
        emit NewMessage(receiver, messageId);
        return messageId;
    }

    function getMyMessagesCount() public view returns(uint) {
        return messages[msg.sender].length;
    }

    // have to get messages one by one because returning string arrays is not possible
    function getMyMessage(uint index) public view returns(uint, uint, address, string memory, string memory, bool, string memory, uint) {
        Message memory m = messages[msg.sender][index];
        return (m.messageId, m.messageType, m.sender, m.senderStr, m.message, m.hasBeenActedUpon, m.attachment, m.pendingRequestId);
    }

    // after a picture is approved for instance, the message doesn't need to be shown to the approver anymore
    function markMessageAsActedUpon(address receiver, uint messageId) public {
        messages[receiver][messageId].hasBeenActedUpon = true;
        emit MessageMarkedAsRead(receiver, messageId);
    }

}
