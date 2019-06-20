pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

contract Fin4Token is ERC20, ERC20Detailed, ERC20Mintable {

  constructor(string memory name, string memory symbol, uint8 decimals)
    ERC20Detailed(name, symbol, decimals)
    ERC20Mintable()
    ERC20()
    public {}

  uint public foo = 3;

  function getFoo() public view returns(uint) {
      return foo;
  }

  function setView(uint n) public returns(uint) {
    foo = n;
    return foo;
  }

}

