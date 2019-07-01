pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

import 'contracts/tokens/ERC20Mintable.sol';
import 'contracts/Fin4TokenBase.sol';
import 'contracts/Fin4MainStrut.sol';
import "contracts/proof/Fin4BaseProofType.sol";

contract Fin4Token is Fin4TokenBase, ERC20Detailed, ERC20Mintable {

  constructor(string memory name, string memory symbol, uint8 decimals, address Fin4MainAddress, address tokenCreatorAddress)
    ERC20Detailed(name, symbol, decimals)
    ERC20Mintable()
    ERC20()
    Fin4TokenBase(Fin4MainAddress, tokenCreatorAddress)
    public {}

  function getName() public view returns(string memory) {
    return name();
  }

  function getSymbol() public view returns(string memory) {
    return symbol();
  }

  function getInfo() public view returns(string memory, string memory) {
    return (name(), symbol());
  }

  address[] public requiredProofTypes;

  function pingbackClaimSubmissionToMain() public returns(bool) {
    Fin4MainStrut(Fin4Main).claimSubmissionPingback(msg.sender);
    return true;
  }

  // called from ProofType contracts, therefore msg.sender is the address of that SC
  function receiveProofApproval(address claimer, uint claimId) public returns(bool) {
    claims[claimId].proof_statuses[msg.sender] = true;
    if (_allProofTypesApprovedOnClaim(claimId)) {
      claims[claimId].isApproved = true;
      // TODO mint
    }
    return true;
  }

  function _allProofTypesApprovedOnClaim(uint claimId) private view returns(bool) {
    for (uint i = 0; i < requiredProofTypes.length; i ++) {
      if (!claims[claimId].proof_statuses[requiredProofTypes[i]]) {
        return false;
      }
    }
    return true;
  }

  function getRequiredProofTypes() public view returns(address[] memory) {
    return requiredProofTypes;
  }

  function addRequiredProofType(address proofType) public returns(bool) {
    // bool isRegistered = Fin4Main.call(bytes4(sha3("proofTypeIsRegistered(address)")), proofType);
    require(Fin4MainStrut(Fin4Main).proofTypeIsRegistered(proofType), "This address is not registered as proof type in Fin4Main");
    requiredProofTypes.push(proofType);
    Fin4BaseProofType(proofType).registerTokenUsingThisProofType(address(this));
    return true;
  }

  function balanceOfMe() public view returns(uint256) {
    return balanceOf(msg.sender);
  }

  function getInfoAndBalance() public view returns(string memory, string memory, uint256) {
    return (name(), symbol(), balanceOf(msg.sender));
  }
}
