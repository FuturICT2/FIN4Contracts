pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import 'contracts/Fin4Token.sol';

contract Fin4Main {

  address[] public children;

	function createNewToken(string memory name, string memory symbol, uint8 decimals) public returns(address) {
    Fin4Token newToken = new Fin4Token(name, symbol, decimals);
    children.push(address(newToken));
    return address(newToken);
  }

  function getChildren() public view returns(address[] memory) {
    return children;
  }

    function getActionNames() public view returns(string[] memory){
      string[] memory actionNames = new string[](children.length);
      for (uint i = 0; i < children.length; i++){
          actionNames[i] = Fin4Token(children[i]).name();
      }
      return actionNames;
    }

    function mintToken(address tokenAddress,uint256 amount) public{
        Fin4Token(tokenAddress).mint(msg.sender,amount);
    }

    function getBalance(address tokenAddress) public view returns(uint256){
        return Fin4Token(tokenAddress).balanceOf(msg.sender);
    }


}
