pragma solidity ^0.5.8;

import "./ERC20Plus.sol";



/**
 * @title ERC20Plus
* @dev ERC20 Token, where all tokens (INITIAL_SUPPLY) are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 * Depending on the parameters provided, this token can be mintable, burnable and/or 
 * pausable (non-transferable).
 */
contract GOV is ERC20Plus {

  mapping(address => mapping(address => uint256)) public delegatedTokens;

  constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    address minter,
    bool _isBurnable,
    bool _isTransferable,
    bool _isMintable,
    uint _initialSupply)
      ERC20Plus(_name,_symbol, _decimals, minter, _isBurnable, _isTransferable, _isMintable, _initialSupply)
      public{}

  function delegate(address to, uint256 value) public {
    require(balanceOf(msg.sender)>=value, "You do not have enough tokens for this transaction");
    delegatedTokens[msg.sender][to]+=value;
    _transfer(msg.sender, to, value);
  }

  function refundeDelegation(address to, uint256 value) public {
    require(balanceOf(to)>=value, "The balance of reciver is too low");

    delegatedTokens[msg.sender][to]+=value;
    _transfer(msg.sender, to, value);
  }
/*
  function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
    _transfer(sender, recipient, amount);
    //_approve(sender, msg.sender, _allowances[sender][msg.sender].sub(amount));
    return true;
    }*/

  function addressToString(address _addr) private pure returns(string memory) {
    bytes32 value = bytes32(uint256(_addr));
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(42);
    str[0] = '0';
    str[1] = 'x';
    for (uint i = 0; i < 20; i++) {
        str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
        str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
    }
    return string(str);
}

}
