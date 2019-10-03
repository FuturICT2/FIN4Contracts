pragma solidity ^0.5.0;

import 'contracts/tokens/ERC20Plus.sol';
import 'contracts/Fin4TokenBase.sol';

contract Fin4Token is Fin4TokenBase, ERC20Plus {

  constructor(string memory name, string memory symbol, string memory description, address Fin4MainAddress, address actionTypeCreatorAddress)
    ERC20Plus(name, symbol, 0, actionTypeCreatorAddress, false, true, true, 0)
    Fin4TokenBase(Fin4MainAddress, actionTypeCreatorAddress, description)
    public {}

  function getInfoAndBalance() public view returns(string memory, string memory, uint256) {
    return (name(), symbol(), balanceOf(msg.sender));
  }

  function getDetailedInfo() public view returns(bool, address[] memory, uint, uint256, uint256) {
    return (msg.sender == actionTypeCreator, requiredProofTypes, nextClaimId, balanceOf(msg.sender), totalSupply());
  }

}
