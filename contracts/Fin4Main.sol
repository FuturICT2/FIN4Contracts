pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import 'contracts/Fin4Token.sol';
import 'contracts/proof/Fin4BaseProofType.sol';

contract Fin4Main {

  address[] public children;

	function createNewToken(string memory name, string memory symbol, uint8 decimals, address[] memory requiredProofTypes) public returns(address) {
    Fin4Token newToken = new Fin4Token(name, symbol, decimals, address(this), msg.sender);

    for (uint i = 0; i < requiredProofTypes.length; i++) {
      newToken.addRequiredProofType(requiredProofTypes[i]);
    }

    children.push(address(newToken));
    return address(newToken);
  }

  function getChildren() public view returns(address[] memory) {
    return children;
  }

  // ------------------------- MINT, TRANSFER, BALANCE -------------------------

  function transferTokens(address tokenAddress, address recepient) public {
      Fin4Token token = Fin4Token(tokenAddress);
      token.transferFrom(msg.sender, recepient, 1);
  }

  function mintToken(address tokenAddress,uint256 amount) public {
      Fin4Token token = Fin4Token(tokenAddress);
      token.mint(msg.sender, amount);
  }

  function getBalance(address tokenAddress) public view returns(uint256) {
      return Fin4Token(tokenAddress).balanceOf(msg.sender);
  }

  function getAllTokenBalance() public view returns(address[] memory, uint256[] memory) {
    uint count = 0;
    for (uint i = 0; i < children.length; i ++) {
        count ++;
    }
    uint[] memory balances = new uint[](count);
    address[] memory addresses = new address[](count);
    uint256 j = 0;
    for (uint i = 0; i < children.length; i++) {
      Fin4Token tok = Fin4Token(children[i]);
      balances[j] = tok.balanceOf(msg.sender);
      addresses[j] = address(tok);
      j++;
    }
    return (addresses, balances);
  }

  // ------------------------- ACTION WHERE USER HAS CLAIMS -------------------------

  mapping (address => address[]) public actionsWhereUserHasClaims; // key = user, value = action addresses

  function _userClaimedOnThisActionAlready(address user, address action) private view returns (bool) {
    for (uint i = 0; i < actionsWhereUserHasClaims[user].length; i++) {
      if (actionsWhereUserHasClaims[user][i] == action) {
        return true;
      }
    }
    return false;
  }

  function getActionsWhereUserHasClaims() public view returns(address[] memory) {
    return actionsWhereUserHasClaims[msg.sender];
  }

  function claimSubmissionPingback(address claimer) public returns(bool) {
    if (!_userClaimedOnThisActionAlready(claimer, msg.sender)) {
      actionsWhereUserHasClaims[claimer].push(msg.sender);
    }
  }
 
  // ------------------------- PROOF TYPES -------------------------

  address[] public proofTypes;

  function addProofType(address proofType) public returns(bool) {
    proofTypes.push(proofType);
    return true;
  }

  function getProofTypes() public view returns(address[] memory) {
    return proofTypes;
  }

  function getProofTypeInfo(address proofType) public view returns(address, string memory, string memory, uint) {
      require(proofTypeIsRegistered(proofType), "Address is not registered as proof type on Fin4Main");
      return (proofType, Fin4BaseProofType(proofType).getName(), Fin4BaseProofType(proofType).getDescription(),
        Fin4BaseProofType(proofType).getSubmitProofMethodArgsCount());
  }

  // called from Fin4Token instances to ensure the required proof types there are a subset of the proofTypes here
  function proofTypeIsRegistered(address proofTypeToCheck) public view returns(bool) {
    for (uint i = 0; i < proofTypes.length; i++) {
      if (proofTypes[i] == proofTypeToCheck) {
        return true;
      }
    }
    return false;
  }

  // ------------------------- MESSAGES -------------------------

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

  function getMyMessagesCount() public view returns(uint) {
    return messages[msg.sender].length;
  }

  function getMyMessage(uint index) public view returns(uint, address, string memory, address, string memory) {
    Message memory m = messages[msg.sender][index];
    return (m.messageType, m.sender, m.message, m.fulfillmentAddress, Fin4BaseProofType(m.fulfillmentAddress).getName());
  }

}
