pragma solidity ^0.5.0;

import 'contracts/tokens/ERC20Plus.sol';
import 'contracts/Fin4TokenBase.sol';

contract Fin4Token is Fin4TokenBase, ERC20Plus {

  constructor(string memory name, string memory symbol, address tokenCreator, bool[] memory properties, uint[] memory values)
    ERC20Plus(name, symbol, uint8(values[1]), tokenCreator, properties[2], properties[0], properties[1], values[2])
    Fin4TokenBase()
    public {}

  // TODO is it possible to move these two functions to Fin4TokenBase?

  function getTokenInfo(address user) public view returns(bool, bool, string memory, string memory,
    string memory, string memory, uint256, uint) {
    bool userIsCreator = user == tokenCreator;
    bool userIsAdmin = userIsCreator; // TODO
    return (userIsCreator, userIsAdmin, name(), symbol(), description, unit, totalSupply(), tokenCreationTime);
  }

  function getDetailedTokenInfo(address user) public view returns(address[] memory, uint, uint256, uint256, uint) {
    return (requiredProofTypes, nextClaimId, balanceOf(user), totalSupply(), tokenCreationTime);
  }
}

// ----------------------------------------------------------------------------------------------------

contract Fin4TokenCapped is Fin4TokenBase, ERC20PlusCapped {

  constructor(string memory name, string memory symbol, address tokenCreator, bool[] memory properties, uint[] memory values)
    ERC20PlusCapped(name, symbol, uint8(values[1]), tokenCreator, properties[2], values[0], properties[0], properties[1], values[2])
    Fin4TokenBase()
    public {}

  function getTokenInfo(address user) public view returns(bool, bool, string memory, string memory,
    string memory, string memory, uint256, uint) {
    bool userIsCreator = user == tokenCreator;
    bool userIsAdmin = userIsCreator; // TODO
    return (userIsCreator, userIsAdmin, name(), symbol(), description, unit, totalSupply(), tokenCreationTime);
  }

  function getDetailedTokenInfo(address user) public view returns(address[] memory, uint, uint256, uint256, uint) {
    return (requiredProofTypes, nextClaimId, balanceOf(user), totalSupply(), tokenCreationTime);
  }
}
