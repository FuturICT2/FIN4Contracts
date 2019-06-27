pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import 'contracts/Fin4Token.sol';

contract Fin4Main {

  address[] public children;

	function createNewToken(string memory name, string memory symbol, uint8 decimals) public returns(address) {
    Fin4Token newToken = new Fin4Token(name, symbol, decimals, address(this));
    children.push(address(newToken));
    return address(newToken);
  }

  function getChildren() public view returns(address[] memory) {
    return children;
  }

  function transferTokens(address tokenAddress, address accountAddress) public {
      Fin4Token token = Fin4Token(tokenAddress);
      token.transfer(accountAddress,1);
  }

  function getActionNames() public view returns(address[] memory) { // string[] memory
    //string[] memory actionNames = new string[](children.length);
    //for (uint i = 0; i < children.length; i++){
    //    actionNames[i] = Fin4Token(children[i]).name();
    //}
    //return (actionNames, children);
    return children;
  }

  function mintToken(address tokenAddress,uint256 amount) public {
      Fin4Token token = Fin4Token(tokenAddress);
      token.mint(msg.sender,amount);
  }

  function getBalance(address tokenAddress) public view returns(uint256) {
      return Fin4Token(tokenAddress).balanceOf(msg.sender);
  }

  function getAllTokenBalance() public view returns(address[] memory, uint256[] memory) {
    uint count = 0;
    for (uint i = 0; i < children.length; i ++) {
      //if (Fin4Token(children[i]).balanceOf(msg.sender) != 0) {
          count ++;
      //}
    }
    uint[] memory balances = new uint[](count);
    address[] memory addresses = new address[](count);

    uint256 j = 0;
    for (uint i = 0; i < children.length; i++){
      Fin4Token tok = Fin4Token(children[i]);
      //uint256 bal = tok.balanceOf(msg.sender);
      //if (bal != 0) {
      balances[j] = tok.balanceOf(msg.sender);
      addresses[j] = address(tok);
      j++;
      //}
    }

    return (addresses, balances);
  }

  // TODO: Mintable Role for other contracts trying to run the mintToken funtion.

  address[] public proofTypes;

  function addProofType(address proofType) public returns(bool) {
    proofTypes.push(proofType);
    return true;
  }

  function getProofTypes() public view returns(address[] memory) {
    return proofTypes;
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

}
