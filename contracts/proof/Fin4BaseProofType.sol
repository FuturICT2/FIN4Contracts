pragma solidity ^0.5.0;

import "contracts/stub/Fin4TokenStub.sol";
import "contracts/Fin4Messaging.sol";
import "contracts/util/utils.sol";

contract Fin4BaseProofType is utils {

  string public name;
  string public description;
  address public Fin4MessagingAddress;

  mapping (address => address) public fin4TokenToItsCreator; // at the same time a register of Fin4Tokens using this proof type
  mapping (address => uint[]) public fin4TokenToParametersSetOnThisProofType; // holds the token-specific parameters for each proof type
                                                                              // (one proof type is used by multiple action types)

  constructor(address Fin4MessagingAddr) public {
    Fin4MessagingAddress = Fin4MessagingAddr;
  }

  function getName() public view returns(string memory) {
    return name;
  }

  function getDescription() public view returns(string memory) {
    return description;
  }

  // includes the token-specific parameters if overriden
  function getParameterizedDescription(address token) public view returns(string memory) {
    return getDescription();
  }

  // called from ProofSubmission in the frontend to display what the user has to submit for a given proof type
  function getParameterizedInfo(address token) public view returns(string memory, string memory, uint[] memory) {
    return (name, getParameterizedDescription(token), fin4TokenToParametersSetOnThisProofType[token]);
  }

  function getInfo() public view returns(string memory, string memory, string memory) {
    return (name, description, getParameterForActionTypeCreatorToSetEncoded());
  }

  // This method gets overriden by the proof types and encode the parameter names (types are only uint for now TODO)
  // to be filled by the action type creator. He gets prompted to set them via a popup in the front end when adding
  // a proof type, see the first <Modal> in ContractForm.render()
  function getParameterForActionTypeCreatorToSetEncoded() public pure returns(string memory) {
    return "";
  }

  // Get's called from the contract Fin4Main.createNewToken() after the parameter arrays there have been dissected
  // into portions for the respective proof types
  function setParameters(address token, uint[] memory params) public returns(bool) {
    // TODO require: only token creator can set this
    fin4TokenToParametersSetOnThisProofType[token] = params;
  }

  // Helper method for all proof types to go through the same method when sending their approvals
  // to the respective claim on a token
  function _sendApproval(address proofTypeAddress, address tokenAdrToReceiveProof, uint claimId) internal returns(bool) {
    // TODO ensure it can only be called from within this SC?
    Fin4TokenStub(tokenAdrToReceiveProof).receiveProofApproval(proofTypeAddress, claimId);
    return true;
  }

  function registerActionTypeCreator(address actionTypeCreator) public returns(bool) {
    fin4TokenToItsCreator[msg.sender] = actionTypeCreator;
    return true;
  }

  // Used by proof types that require the token creator to approve something
  function getCreatorOfToken(address tokenAddress) public view returns(address) {
    return fin4TokenToItsCreator[tokenAddress];
  }

}
