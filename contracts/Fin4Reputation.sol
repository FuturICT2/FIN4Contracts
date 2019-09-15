pragma solidity ^0.5.8;

import "./tcr/Parameterizer.sol";
import "./tokens/ERC20Plus.sol";
import "./tokens/GOV.sol";


contract Fin4Reputation is ERC20Plus {

    GOV public GOVToken;

    constructor()
      ERC20Plus("Fin4Reputation", "REP", 250, address(0), true, true, true,0)
      public{}

    function init(address _token) public {
        require(_token != address(0) && address(GOVToken) == address(0), "_token is null or GOVToken is not null");
        GOVToken = GOV(_token);
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
    return super.mint(to, value);
  }

  function getGOVFromReputation() public returns (bool) {
    Parameterizer parameterizer = GOVToken.parameterizer();
    require(balanceOf(msg.sender) > parameterizer.get("pminReputation"), "user has less than pminReputation");
    getGOVFromReputation(msg.sender);
    return true;
  }

  // for deployment-dev only, make sure this can't be misused
  function getGOVFromReputation(address tokenHolder) public returns (bool) {
    require(GOVToken.balanceOf(tokenHolder) + GOVToken.getAmountsDelegatedByAUser(tokenHolder) < balanceOf(tokenHolder),
      "Can't reset GOV balance because the user has more GOV than REP tokens (including delegated tokens).");
    GOVToken.mint(tokenHolder, balanceOf(tokenHolder) - GOVToken.balanceOf(tokenHolder));
    return true;
  }

  function getGOVTokenAddress() public view returns (address) {
      return address(GOVToken);
  }

  function getGOVTokenAmount() public view returns (uint256) {
      return GOVToken.balanceOf(msg.sender);
  }

}
