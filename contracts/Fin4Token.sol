pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

contract Fin4Token is ERC20Detailed, ERC20Mintable {

  constructor(string memory name, string memory symbol, uint8 decimals)
    ERC20Detailed(name, symbol, decimals)
    ERC20Mintable()
    ERC20()
    public {}

  address[] public requiredProofs;

  // called from ProofDummy, therefore msg.sender is the address of that SC
  function receiveProofApproval(address claimer, uint claimId) public returns(bool) {
    // claims[claimId].proof_statuses[msg.sender] = true;
    // TODO if all required proofs are true, switch isApproved to true
    return true;
  }

  function getRequiredProofs() public view returns(address[] memory) {
    return requiredProofs;
  }

  function addRequiredProof(address proofType) public returns(bool) {
    requiredProofs.push(proofType);
    return true;
  }

  function balanceOfMe() public view returns(uint256) {
    return balanceOf(msg.sender);
  }
}
