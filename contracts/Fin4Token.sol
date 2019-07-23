pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

import 'contracts/Fin4TokenBase.sol';

contract Fin4Token is Fin4TokenBase, ERC20Detailed, ERC20Mintable {

  uint8 d = 0;

  constructor(string memory name, string memory symbol, address Fin4MainAddress, address actionTypeCreatorAddress)
    // default decimals to 0
    ERC20Detailed(name, symbol, d)
    ERC20Mintable()
    ERC20()
    Fin4TokenBase(Fin4MainAddress, actionTypeCreatorAddress)
    public {}

  function getInfoAndBalance() public view returns(string memory, string memory, uint256) {
    return (name(), symbol(), balanceOf(msg.sender));
  }

}
