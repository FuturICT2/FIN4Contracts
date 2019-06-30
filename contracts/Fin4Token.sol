pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

import 'contracts/Fin4ClaimableAbstract.sol';
import 'contracts/Fin4MainAbstract.sol';

contract Fin4Token is Fin4ClaimableAbstract, ERC20Detailed, ERC20Mintable {

  constructor(string memory name, string memory symbol, uint8 decimals, address Fin4MainAdr)
    ERC20Detailed(name, symbol, decimals)
    ERC20Mintable()
    ERC20()
    public {
      Fin4Main_adr = Fin4MainAdr;
    }

  function getName() public view returns(string memory) {
    return name();
  }

  function getSymbol() public view returns(string memory) {
    return symbol();
  }

  address public Fin4Main_adr;
  address[] public requiredProofTypes;

  function pingbackClaimSubmissionToMain() public returns(bool) {
    Fin4MainAbstract(Fin4Main_adr).claimSubmissionPingback(msg.sender);
    return true;
  }

  // called from ProofDummy, therefore msg.sender is the address of that SC
  function receiveProofApproval(address claimer, uint claimId) public returns(bool) {
    claims[claimId].proof_statuses[msg.sender] = true;
    // TODO if all required proofs are true, switch isApproved to true
    return true;
  }

  function getRequiredProofTypes() public view returns(address[] memory) {
    return requiredProofTypes;
  }

  function addRequiredProofType(address proofType) public returns(bool) {
    // bool isRegistered = Fin4Main_adr.call(bytes4(sha3("proofTypeIsRegistered(address)")), proofType);
    // require(Fin4MainAbstract(Fin4Main_adr).proofTypeIsRegistered(proofType), "Proof type is not registered in Fin4Main");
    requiredProofTypes.push(proofType);
    return true;
  }

  function balanceOfMe() public view returns(uint256) {
    return balanceOf(msg.sender);
  }
}
