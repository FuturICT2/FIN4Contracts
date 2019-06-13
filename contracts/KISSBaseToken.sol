pragma solidity ^0.5.0;

import "contracts/Fin4BaseToken.sol";

contract KISSBaseToken is Fin4BaseToken {

  constructor(string memory name, string memory symbol, uint8 decimals) Fin4BaseToken(name, symbol, decimals) public {}

}
