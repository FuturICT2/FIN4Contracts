pragma solidity ^0.5.8;

import "./ERC20Plus.sol";
import "./../tcr/Parameterizer.sol";
import "./../tcr/Registry.sol";
import "./../tcr/PLCR/PLCRVoting.sol";



/**
 * @title ERC20Plus
* @dev ERC20 Token, where all tokens (INITIAL_SUPPLY) are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 * Depending on the parameters provided, this token can be mintable, burnable and/or 
 * pausable (non-transferable).
 */
contract GOV is ERC20Plus {

  mapping(address => mapping(address => uint256)) internal delegatorTokens;
  mapping(address => uint256) internal delegateeTokens;

  PLCRVoting public voting;
  Parameterizer public parameterizer;
  Registry public registry;

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

  function delegate(address to, uint256 amount) public {
    require(balanceOf(msg.sender) >= amount, "You do not have enough tokens for this transaction");

    delegatorTokens[msg.sender][to] += amount;
    delegateeTokens[to] += amount;

    _transfer(msg.sender, to, amount);
  }

  function refundDelegation(address to, uint256 amount) public {
    require(balanceOf(to) >= amount, "The balance of reciver is too low");
    require(delegatorTokens[msg.sender][to] >= amount, "You do not have that much delegation for this account");
    delegatorTokens[msg.sender][to] -= amount;
    delegateeTokens[to] -= amount;

    _transfer(to, msg.sender, amount);
  }

  function transfer(address recipient, uint256 amount) public returns (bool) {
    if (balanceOf(msg.sender) - amount < delegateeTokens[msg.sender]){
      require(recipient == address(voting) || recipient == address(parameterizer) || recipient == address(registry), "You do not have enough Tokens. You can only use delegated tokens on Registry contracts");
    }
    return super.transfer(recipient, amount);
  }

  function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
    if (balanceOf(msg.sender) - amount < delegateeTokens[msg.sender]){
      require(recipient == address(voting) || recipient == address(parameterizer) || recipient == address(registry), "You do not have enough Tokens. You can only use delegated tokens on Registry contracts");
    }
    return super.transferFrom(sender, recipient, amount);
  }

  //function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)

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
