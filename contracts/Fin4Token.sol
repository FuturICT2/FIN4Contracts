pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

import 'contracts/tokens/ERC20Mintable.sol';
import 'contracts/Fin4TokenBase.sol';

contract Fin4Token is Fin4TokenBase, ERC20Detailed, ERC20Mintable {

  constructor(string memory name, string memory symbol, uint8 decimals, address Fin4MainAddress, address actionTypeCreatorAddress)
    ERC20Detailed(name, symbol, decimals)
    ERC20Mintable()
    ERC20()
    Fin4TokenBase(Fin4MainAddress, actionTypeCreatorAddress)
    public {}

  function getInfoAndBalance() public view returns(string memory, string memory, uint256) {
    return (name(), symbol(), balanceOf(msg.sender));
  }

}
