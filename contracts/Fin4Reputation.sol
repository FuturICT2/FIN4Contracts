pragma solidity ^0.5.8;

import "./tcr/PLCR/PLCRFactory.sol";
import "./tcr/PLCR/PLCRVoting.sol";
import "./tcr/Parameterizer.sol";
import "./tokens/ERC20Plus.sol";


contract Fin4Reputation is ERC20Plus {

    ERC20Plus public GOVToken;

    constructor()//ERC20Plus _GOVToken)
      ERC20Plus("Fin4Reputation", "REP", 250, address(0), true, true, true,0)
      public{}

    function init(address _token) public {
        require(_token != address(0) && address(GOVToken) == address(0));
        GOVToken = ERC20Plus(_token);
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
    // TODO require balanceOf(GOVToken) < balanceOf(this rep token)
    return GOVToken.mint(msg.sender, 10);
  }

  function getGOVTokenAddress() public view returns (address) {
      return address(this.GOVToken);
  }
  function getGOVTokenAmount() public view returns (uint256) {
      return 0;// this.GOVToken.balanceOf(msg.sender);
  }

}
