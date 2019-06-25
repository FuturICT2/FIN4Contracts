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

  function transferTokens(address tokenAddress, address accountAddress) public{
      Fin4Token token = Fin4Token(tokenAddress);
      token.transfer(accountAddress,1);
  }

  function getActionNames() public view returns(address[] memory) { // string[] memory
    //string[] memory actionNames = new string[](children.length);
    //for (uint i = 0; i < children.length; i++){
    //    actionNames[i] = Fin4Token(children[i]).name();
    //}
    //return (actionNames, children);
    return children;
  }

  function mintToken(address tokenAddress,uint256 amount) public{
      Fin4Token token = Fin4Token(tokenAddress);
      token.mint(msg.sender,amount);
  }

  function getBalance(address tokenAddress) public view returns(uint256){
      return Fin4Token(tokenAddress).balanceOf(msg.sender);
  }

  function getAllTokenBalance() public view returns(address[] memory, uint256[] memory) {
    uint count = 0;
    for (uint i = 0; i < children.length; i ++) {
      //if (Fin4Token(children[i]).balanceOf(msg.sender) != 0) {
          count ++;
      //}
    }
    uint[] memory balances = new uint[](count);
    address[] memory addresses = new address[](count);

    uint256 j = 0;
    for (uint i = 0; i < children.length; i++){
      Fin4Token tok = Fin4Token(children[i]);
      //uint256 bal = tok.balanceOf(msg.sender);
      //if (bal != 0) {
      balances[j] = tok.balanceOf(msg.sender);
      addresses[j] = address(tok);
      j++;
      //}
    }

    return (addresses, balances);
  }

  //TODO: Mintable Role for other contracts trying to run the mintToken funtion.

  uint nextClaimId = 0;

	struct Claim {
    uint claimId;
    address claimer;
    bool isApproved;
    address actionAdr;
    uint quantity;
    uint date;
    string comment;
    mapping(address => bool) proof_statuses;
  }

	mapping (uint => Claim) public claims;

	function submit(address action, uint quantity, uint date, string memory comment) public returns (uint) {
    Claim storage claim = claims[nextClaimId];
    claim.claimer = msg.sender;
    claim.actionAdr = action;
    claim.quantity = quantity;
    claim.date = date;
    claim.comment = comment;
    address[] memory requiredProofs = Fin4Token(action).getRequiredProofTypes();
    for (uint i = 0; i < requiredProofs.length; i ++) {
      claim.proof_statuses[requiredProofs[i]] = false;
    }
    //TODO: Need to be always set to false
    //We set it to true just for the Demo to show the transfer to token to the user
    if (nextClaimId % 2 == 0) {
        claim.isApproved = false;
    } else {
      claim.isApproved = true;
      mintToken(action, quantity);
    }
    nextClaimId ++;
    return nextClaimId - 1;
  }

  function getStatuses() public view returns(uint[] memory, bool[] memory, uint[] memory) {
    uint count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          count ++;
      }
    }
    uint[] memory ids = new uint[](count);
    uint[] memory quantity = new uint[](count);
    bool[] memory states = new bool[](count);
    count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          ids[count] = i;
          states[count] = claims[i].isApproved;
          quantity[count] = claims[i].quantity;
          count ++;
      }
    }
    return (ids,states,quantity);
  }

  // for dev purposes only, this is NOT the normal flow
  function approveClaim(uint claimId) public returns(bool) {
    claims[claimId].isApproved = true;
    return true;
  }
}
