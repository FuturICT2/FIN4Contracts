pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import 'contracts/Fin4Token.sol';
import 'contracts/proof/Fin4BaseProofType.sol';

contract Fin4Main {

  address[] public children;
  // mapping (address => bool) public officialChildren; // TODO for Sergiu's TCR

	function createNewToken(string memory name, string memory symbol, address[] memory requiredProofTypes,
    uint[] memory paramValues, uint[] memory paramValuesIndices) public returns(address) {
    Fin4Token newToken = new Fin4Token(name, symbol, address(this), msg.sender);

    for (uint i = 0; i < requiredProofTypes.length; i++) {
      newToken.addRequiredProofType(requiredProofTypes[i]);
      // ProofTypes must be minters because "they" (via msg.sender) are the ones calling mint() if the last required proof type is set to true
      newToken.addMinter(requiredProofTypes[i]);
      uint indexStart = paramValuesIndices[i * 2];
      uint indexEnd = paramValuesIndices[i * 2 + 1];
      if (indexStart != 99) {
        uint paramsCount = indexEnd - indexStart + 1;
        uint[] memory params = new uint[](paramsCount);
        for (uint j = indexStart; j <= indexEnd; j ++) {
            params[j - indexStart] = paramValues[j];
        }
        Fin4BaseProofType(requiredProofTypes[i]).setParameters(address(newToken), params);
      }
    }
    children.push(address(newToken));
    return address(newToken);
  }

  function getChildren() public view returns(address[] memory) {
    return children;
  }

  function getChildrenWhereUserHasNonzeroBalance(address msg_sender_tmp) public view returns(address[] memory) {
    address[] memory tokens = actionsWhereUserHasClaims[msg_sender_tmp];
    uint count = 0;
    for (uint i = 0; i < tokens.length; i ++) {
      if (getBalance(msg_sender_tmp, tokens[i]) > 0) {
        count ++;
      }
    }
    address[] memory nonzeroBalanceTokens = new address[](count);
    for (uint i = 0; i < count; i ++) {
      if (getBalance(msg_sender_tmp, tokens[i]) > 0) {
        nonzeroBalanceTokens[i] = tokens[i];
      }
    }
    return nonzeroBalanceTokens;
  }

  // ------------------------- MINT, TRANSFER, BALANCE -------------------------

  function getBalance(address msg_sender_tmp, address tokenAddress) public view returns(uint256) {
      return Fin4Token(tokenAddress).balanceOf(msg_sender_tmp);
  }

  // ------------------------- ACTION WHERE USER HAS CLAIMS -------------------------

  mapping (address => address[]) public actionsWhereUserHasClaims; // key = user, value = action addresses

  function _userClaimedOnThisActionAlready(address user, address action) private view returns (bool) {
    for (uint i = 0; i < actionsWhereUserHasClaims[user].length; i++) {
      if (actionsWhereUserHasClaims[user][i] == action) {
        return true;
      }
    }
    return false;
  }

  function getActionsWhereUserHasClaims(address msg_sender_tmp) public view returns(address[] memory) {
    return actionsWhereUserHasClaims[msg_sender_tmp];
  }

  function claimSubmissionPingback(address claimer, address token) public returns(bool) {
    if (!_userClaimedOnThisActionAlready(claimer, token)) {
      actionsWhereUserHasClaims[claimer].push(token);
    }
  }

  function submitClaim(address tokenAddress, uint quantity, uint date, string memory comment) public returns(uint) {
    claimSubmissionPingback(msg.sender, tokenAddress);
    return Fin4Token(tokenAddress).submit(msg.sender, quantity, date, comment);
  }

  // ------------------------- PROOF TYPES -------------------------

  address[] public proofTypes;

  function addProofType(address proofType) public returns(bool) {
    proofTypes.push(proofType);
    return true;
  }

  function getProofTypes() public view returns(address[] memory) {
    return proofTypes;
  }

  function getProofTypeName(address proofType) public view returns(string memory) {
    require(proofTypeIsRegistered(proofType), "Address is not registered as proof type on Fin4Main");
    return Fin4BaseProofType(proofType).getName();
  }

  // called from Fin4Token instances to ensure the required proof types there are a subset of the proofTypes here
  function proofTypeIsRegistered(address proofTypeToCheck) public view returns(bool) {
    for (uint i = 0; i < proofTypes.length; i++) {
      if (proofTypes[i] == proofTypeToCheck) {
        return true;
      }
    }
    return false;
  }

  // ------------------------- MESSAGES -------------------------

  address public Fin4MessagesAddr;

  function setFin4MessagesAddress(address addr) public {
    Fin4MessagesAddr = addr;
  }

  function getFin4MessagesAddress() public view returns(address) {
    return Fin4MessagesAddr;
  }

}
