pragma solidity ^0.5.0;

import 'contracts/tokens/ERC20Plus.sol';
import 'contracts/Fin4TokenBase.sol';

contract Fin4Token is Fin4TokenBase, ERC20Plus {

  constructor(string memory name, string memory symbol, string memory description, string memory unit, address actionTypeCreatorAddress)
    ERC20Plus(name, symbol, 0, actionTypeCreatorAddress, false, true, true, 0)
    Fin4TokenBase(description, unit, actionTypeCreatorAddress)
    public {}

  function getTokenInfo(address user) public view returns(bool, bool, string memory, string memory, string memory, string memory, uint256) {
    bool userIsAdmin = false; // TODO
    return (user == actionTypeCreator, userIsAdmin, name(), symbol(), description, unit, totalSupply());
  }

  function getDetailedTokenInfo(address user) public view returns(address[] memory, uint, uint256, uint256, uint) {
    return (requiredProofTypes, nextClaimId, balanceOf(user), totalSupply(), tokenCreationTime);
  }

}
