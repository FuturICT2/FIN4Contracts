pragma solidity ^0.5.17;

import "../tcr/Parameterizer.sol";
import "./ERC20Plus.sol";
import "./GOV.sol";


contract REP is ERC20Plus {

    GOV public GOVToken;
    mapping (address => uint256) private _balances;

    constructor()
      ERC20Plus("Fin4Reputation", "REP", 250, address(0), true, false, true, 0, address(0))
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
    function mint(address to, uint256 value) public returns (bool) {
      return super.mint(to, value);
    }

    /**
     * @dev Burns a specific amount of tokens from the target address and decrements allowance
     * @param from address The address which you want to send tokens from
     * @param value uint256 The amount of token to be burned
     */
    function burnFrom(address from, uint256 value) public {
        // Checks whether token is burnable before minting
        require(isBurnable, "Coin not burnable");
        // Gets REP balance of user
        uint balance = balanceOf(from);
        // Handles special case where user does not have enough REP in his balance as the amount to be deducted
        if(balance<value)
          _burn(from, balance);
        else
          _burn(from, value);
    }

    /**
    @dev Used to mint GOV tokens based on existing REP tokens
    */
    function getGOVFromReputation() public returns (bool) {
      Parameterizer parameterizer = GOVToken.parameterizer();
      require(balanceOf(msg.sender) > parameterizer.get("pminReputation"), "user has less than pminReputation");
      getGOVFromReputation(msg.sender);
      return true;
    }

    // for deployment-dev only, make sure this can't be misused => change access modifier to internal or private
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
