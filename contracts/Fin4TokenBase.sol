pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import 'contracts/Fin4MainStrut.sol';
import "contracts/proof/Fin4BaseProofType.sol";

contract Fin4TokenBase { // abstract class

  address public Fin4Main;
  address public tokenCreator;

  constructor(address Fin4MainAddress, address tokenCreatorAddress) public {
    Fin4Main = Fin4MainAddress;
    tokenCreator = tokenCreatorAddress;
  }

  function name() public view returns(string memory);
  function symbol() public view returns(string memory);

  function getInfo() public view returns(string memory, string memory) {
    return (name(), symbol());
  }

  // ------------------------- CLAIM -------------------------

  uint nextClaimId = 0;

	struct Claim {
    uint claimId;
    address claimer;
    bool isApproved;
    uint quantity;
    uint date;
    string comment;
    mapping(address => bool) proof_statuses;
  }

	mapping (uint => Claim) public claims;

	function submit(uint quantity, uint date, string memory comment) public returns (uint) {
    Claim storage claim = claims[nextClaimId];
    claim.claimer = msg.sender;
    claim.quantity = quantity;
    claim.date = date;
    claim.comment = comment;
    address[] memory requiredProofs = getRequiredProofTypes();
    for (uint i = 0; i < requiredProofs.length; i ++) {
      claim.proof_statuses[requiredProofs[i]] = false;
    }
    claim.isApproved = false;
    nextClaimId ++;
    pingbackClaimSubmissionToMain();
    return nextClaimId - 1;
  }

  function getClaim(uint claimId) public view returns(string memory, string memory,
    address, bool, uint, uint, string memory, address[] memory, bool[] memory) {
    // require(claims[claimId].claimer == msg.sender, "This claim was not submitted by the sender");

    Claim storage claim = claims[claimId];
    // this assumes these are still the same as when the claim was submitted
    // should we support an evolving set of proof types though? TODO
    address[] memory requiredProofTypes = getRequiredProofTypes();
    bool[] memory proofTypeStatuses = new bool[](requiredProofTypes.length);
    for (uint i = 0; i < requiredProofTypes.length; i ++) {
      proofTypeStatuses[i] = claim.proof_statuses[requiredProofTypes[i]];
    }

    return (name(), symbol(), claim.claimer, claim.isApproved,
      claim.quantity, claim.date, claim.comment, requiredProofTypes, proofTypeStatuses);
  }

  function getClaimInfo(uint claimId) public view returns(address, bool, uint, uint, string memory) {
    return (claims[claimId].claimer, claims[claimId].isApproved,
      claims[claimId].quantity, claims[claimId].date, claims[claimId].comment);
  }

  function getMyClaimIds() public view returns(address, string memory, string memory, uint[] memory) {
    uint count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          count ++;
      }
    }
    uint[] memory ids = new uint[](count);
    count = 0;
    for (uint i = 0; i < nextClaimId; i ++) {
      if (claims[i].claimer == msg.sender) {
          ids[count] = i;
          count ++;
      }
    }
    return (address(this), name(), symbol(), ids);
  }

  // ------------------------- PROOF TYPES -------------------------

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
    require(Fin4MainStrut(Fin4Main).proofTypeIsRegistered(proofType),
      "This address is not registered as proof type in Fin4Main");
    requiredProofTypes.push(proofType);
    Fin4BaseProofType(proofType).registerTokenUsingThisProofType(address(this));
    return true;
  }

}
