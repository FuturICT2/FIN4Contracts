pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

contract Fin4Token is ERC20Detailed, ERC20Mintable {

  constructor(string memory name, string memory symbol, uint8 decimals, address Fin4MainAdr)
    ERC20Detailed(name, symbol, decimals)
    ERC20Mintable()
    ERC20()
    public {
      Fin4Main_adr = Fin4MainAdr;
    }

  address public Fin4Main_adr;
  address[] public requiredProofTypes;

  // called from ProofDummy, therefore msg.sender is the address of that SC
  function receiveProofApproval(address claimer, uint claimId) public returns(bool) {
    // claims[claimId].proof_statuses[msg.sender] = true;
    // TODO if all required proofs are true, switch isApproved to true
    return true;
  }

  function getRequiredProofTypes() public view returns(address[] memory) {
    return requiredProofTypes;
  }

  function addRequiredProofType(address proofType) public returns(bool) {
    requiredProofTypes.push(proofType);
    return true;
  }

  function balanceOfMe() public view returns(uint256) {
    return balanceOf(msg.sender);
  }
}
