pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";


/**
 * @title ERC20Plus
* @dev ERC20 Token, where all tokens (INITIAL_SUPPLY) are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 * Depending on the parameters provided, this token can be mintable, burnable and/or 
 * pausable (non-transferable).
 */
contract ERC20Plus is ERC20Mintable, ERC20Burnable, ERC20Pausable {

  string public  name; // TODO store this in ERC20Detailed instead of here?
  string public  symbol;
  uint8 public  decimals;

  bool   public  isBurnable;
  bool   public  isTransferable;
  bool   public  isMintable;

  bool   private constructing = true;

  /**
   * @dev Burns a specific amount of tokens.
   * @param value The amount of token to be burned.
   */
  function burn(uint256 value) public {
      // Checks whether token is burnable before minting
      require(isBurnable, "Coin not burnable");
      super.burn(value);
  }

  function who() public view returns (address)
  {
    return msg.sender;
  }

  /**
   * @dev Burns a specific amount of tokens from the target address and decrements allowance
   * @param from address The address which you want to send tokens from
   * @param value uint256 The amount of token to be burned
   */
  function burnFrom(address from, uint256 value) public {
      // Checks whether token is burnable before minting
      require(isBurnable, "Coin not burnable");
      super.burnFrom(from, value);
  }

  /**
   * @dev Function to mint tokens
   * @param to The address that will receive the minted tokens.
   * @param value The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(
    address to,
    uint256 value
  )
    public
    returns (bool)
  {
    // Checks whether token is mintable before minting
    require(isMintable, "Coin not mintable");
    return super.mint(to, value);
  }

  /**
   * @dev called by the owner to pause, triggers stopped state.
   * This means functions transfer, transferFrom, approve, increaseAllowance,
   * and decreasAllowance, will not execute.
   */
  function pause() public{
    // Checks whether token is being constructed, throws exception if not
    require(constructing, "this function can only be run on creation");
    super.pause();
  }

   /**
   * @dev This will undo pause(). The purpose of this declaration is to
   * disable this function, as this function must not be called (unless
   * making an untransferable token transferable again is wanted, but
   * this is currently not an offered feature).
   */
  function unpause() public{
    // Checks whether token is being constructed, throws exception if not
    require(constructing, "this function can only be run on creation");
  }

  constructor(
    string memory name_,
    string memory symbol_,
    uint8 decimals_,
    address minter,
    bool isBurnable_,
    bool isTransferable_,
    bool isMintable_,
    uint initialSupply)
      ERC20()
      ERC20Mintable()
      ERC20Burnable()
      ERC20Pausable()
      public
  {
    name = name_;
    symbol = symbol_;
    decimals = decimals_;
    isBurnable = isBurnable_;
    isTransferable = isTransferable_;
    isMintable = isMintable_;
    if(!isTransferable_){
      pause();
    }
    if(address(minter) != address(0)) {
        _addMinter(minter);}
    _mint(msg.sender, initialSupply);
    // To indicate construction is over, and block pause() and unpause()
    // from being used
    constructing = false;
  }
}

/**
 * @title ERC20PlusCapped
 * @dev ERC20 Token, which acts very similarly to ERC20Plus, but with the
 * exception that it has a cap.
 */
contract ERC20PlusCapped is ERC20Capped, ERC20Plus {

  constructor(
    string memory name_,
    string memory symbol_,
    uint8 decimals_,
    address minter,
    bool isBurnable_,
    uint cap_,
    bool isTransferable_,
    bool isMintable_,
    uint initialSupply)
      public
      // ERC20Capped constructor
      ERC20Capped(cap_)
      // ERC20Plus constructor
      ERC20Plus(
          name_,
          symbol_,
          decimals_,
          minter,
          isBurnable_,
          isTransferable_,
          isMintable_,
          initialSupply)
  {
  }
}