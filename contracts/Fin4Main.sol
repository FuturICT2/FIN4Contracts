pragma solidity ^0.5.0;

import 'contracts/Fin4Token.sol';

contract Fin4Main {

  address[] public children;

	function createNewToken(string memory name, string memory symbol, uint8 decimals) public returns(address) {
    Fin4Token newToken = new Fin4Token(name, symbol, decimals);
    children.push(address(newToken));
    return address(newToken);
  }

  function getChildren() public view returns(address[] memory) {
    return children;
  }

}
