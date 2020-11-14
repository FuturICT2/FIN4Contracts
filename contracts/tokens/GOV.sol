pragma solidity ^0.5.17;

import "./ERC20Plus.sol";
import "./../tcr/Parameterizer.sol";
import "./../tcr/Registry.sol";
import "./../tcr/PLCR/PLCRVoting.sol";

/**
 * @title GOV
 * @dev Token used for governance
 */
contract GOV is ERC20Plus {

    mapping(address => mapping(address => uint256)) private delegatorTokens;
    // Total amount of tokens a user has delegated
    mapping(address => uint256) private delegatorTokensTotal;
    // The tokens that have been delagated to you
    mapping(address => uint256) private delegateeTokens;

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
            ERC20Plus(_name,_symbol, _decimals, minter, _isBurnable, _isTransferable, _isMintable, _initialSupply, address(0))
            public{}

    function init(address _registry, address _parameterizer, address _voting) public {
        require(_registry != address(0) && address(registry) == address(0), "Contract already initialized");
        registry = Registry(_registry);
        parameterizer = Parameterizer(_parameterizer);
        voting = PLCRVoting(_voting);
    }

    /**
    @dev Returns the amount of tokens delegated by the specified _tokenHolder
    */
    function getAmountsDelegatedByAUser(address _tokenHolder) public returns(uint256) {
        return delegatorTokensTotal[_tokenHolder];
    }

    /**
    @dev Returns the amount of tokens delegated to the caller
    */
    function getAmountsDelegatedToMe() public returns(uint256) {
        return delegateeTokens[msg.sender];
    }

    /**
    @dev Delegates tokens to an address
    @param to Address of the user who should receive the amount of tokens
    @param amount Amount of tokens received
    */
    function delegate(address to, uint256 amount) public returns (bool) {
        require(msg.sender != to, "You cannot delegate to yourself");
        require(balanceOf(msg.sender) - delegateeTokens[msg.sender] >= amount, "You do not have enough tokens for this transaction");

        delegatorTokens[msg.sender][to] += amount;
        delegateeTokens[to] += amount;
        delegatorTokensTotal[msg.sender] += amount;
        _transfer(msg.sender, to, amount);
        return true;
    }

    /**
    @dev Refunds delegated tokens from an address
    @param to Address of the user who received delegated tokens
    @param amount Amount of tokens to refund
    */
    function refundDelegation(address to, uint256 amount) public returns (bool) {
        require(balanceOf(to) >= amount, "The balance of reciver is too low");
        require(delegatorTokens[msg.sender][to] >= amount, "You do not have that much delegation for this account");

        delegatorTokens[msg.sender][to] -= amount;
        delegateeTokens[to] -= amount;
        delegatorTokensTotal[msg.sender] -= amount;

        _transfer(to, msg.sender, amount);
        return true;
    }

    /**
    @dev Overriding the ERC20 transfer function to limit transferability
    */
    function transfer(address recipient, uint256 amount) public returns (bool) {
        require (balanceOf(msg.sender) >= amount, "transfer: Not enough balance");
        if(msg.sender != address(voting) && msg.sender != address(parameterizer) && msg.sender != address(registry)){
            require(recipient == address(voting) || recipient == address(parameterizer) || recipient == address(registry),
                "You do not have enough Tokens. You can only use delegated tokens on Registry contracts");
        }
        return super.transfer(recipient, amount);
    }

    /**
    @dev Overriding the ERC20 transferFrom function to limit transferability
    */
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        require (balanceOf(sender) >= amount, "transferFrom: Not enough balance");
        if(sender != address(voting) && sender != address(parameterizer) && sender != address(registry)){
            require(recipient == address(voting) || recipient == address(parameterizer) || recipient == address(registry),
                "You do not have enough Tokens. You can only use delegated tokens on Registry contracts");
            }
        return super.transferFrom(sender, recipient, amount);
    }
}
