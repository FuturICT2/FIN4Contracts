pragma solidity ^0.5.8;

import "./ERC20Plus.sol";
import "./../tcr/Parameterizer.sol";
import "./../tcr/Registry.sol";
import "./../tcr/PLCR/PLCRVoting.sol";

/**
  * @title GOV
  * @dev Token used for governance
 */
contract GOV is ERC20Plus {

  mapping(address => mapping(address => uint256)) public delegatorTokens;
  mapping(address => uint256) public delegateeTokens;

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

    function init(address _registry, address _parameterizer, address _voting) public {
        require(_registry != address(0) && address(registry) == address(0), "Contract already initialized");
        registry = Registry(_registry);
        parameterizer = Parameterizer(_parameterizer);
        voting = PLCRVoting(_voting);
    }

  function delegate(address to, uint256 amount) public returns (bool){
    require(msg.sender != to, "You cannot delegate to yourself");
    require(balanceOf(msg.sender) >= amount, "You do not have enough tokens for this transaction");

    delegatorTokens[msg.sender][to] += amount;
    delegateeTokens[to] += amount;

    _transfer(msg.sender, to, amount);
    return true;
  }

  function refundDelegation(address to, uint256 amount) public returns (bool){
    require(balanceOf(to) >= amount, "The balance of reciver is too low");
    require(delegatorTokens[msg.sender][to] >= amount, "You do not have that much delegation for this account");
    delegatorTokens[msg.sender][to] -= amount;
    delegateeTokens[to] -= amount;

    _transfer(to, msg.sender, amount);
    return true;
  }

  function transfer(address recipient, uint256 amount) public returns (bool) {
    require (balanceOf(msg.sender) > amount, "transfer: Not enough balance");
    if(recipient != address(voting) && recipient != address(parameterizer) && recipient != address(registry)){
      require(recipient == address(voting) || recipient == address(parameterizer) || recipient == address(registry),
        "You do not have enough Tokens. You can only use delegated tokens on Registry contracts");
    }
    return super.transfer(recipient, amount);
  }

  function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
    require (balanceOf(sender) >= amount, "transferFrom: Not enough balance");
    if(recipient != address(voting) && recipient != address(parameterizer) && recipient != address(registry)){
      require(recipient == address(voting) || recipient == address(parameterizer) || recipient == address(registry),
        "You do not have enough Tokens. You can only use delegated tokens on Registry contracts");
      }
    return super.transferFrom(sender, recipient, amount);
  }
}
