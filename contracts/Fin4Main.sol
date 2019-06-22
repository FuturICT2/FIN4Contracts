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

    function getActionNames() public view returns(string[] memory, address[] memory) {
      string[] memory actionNames = new string[](children.length);
      for (uint i = 0; i < children.length; i++){
          actionNames[i] = Fin4Token(children[i]).name();
      }
      return (actionNames, children);
    }

    function mintToken(address tokenAddress,uint256 amount) public{
        Fin4Token token = Fin4Token(tokenAddress);
        token.mint(msg.sender,amount);
    }

    function getBalance(address tokenAddress) public view returns(uint256){
        return Fin4Token(tokenAddress).balanceOf(msg.sender);
    }

    //TODO: Please fix this implementation. It's not optimal
    function getAllTokenBalance() public view returns(string[] memory, string[] memory, uint256[] memory){
      //Fin4Actions[] memory fin4Tokens = new Fin4Actions[](children.length);
        uint count = 0;
        for (uint i = 0; i < children.length; i ++) {
          if (Fin4Token(children[i]).balanceOf(msg.sender) != 0) {
              count ++;
          }
        }
        uint[] memory balance = new uint[](count);
        string[] memory name = new string[](count);
        string[] memory symbol = new string[](count);

        uint256 j = 0;
        for (uint i = 0; i < children.length; i++){
          Fin4Token tok = Fin4Token(children[i]);
          uint256 bal = tok.balanceOf(msg.sender);
          if (bal != 0) {
                name[j] = tok.name();
                symbol[j] = tok.symbol();
                balance[j] = tok.balanceOf(msg.sender);
                j++;
          }
        }

        return(symbol,name,balance);
    }
}
