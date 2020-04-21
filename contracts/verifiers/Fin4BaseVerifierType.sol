pragma solidity ^0.5.0;

import "contracts/stub/Fin4TokenStub.sol";
import "contracts/Fin4Messaging.sol";
import "contracts/util/utils.sol";

contract Fin4BaseVerifierType is utils {

  string public name;
  string public description;
  bool public isAutoInitiable = false; // shortcuts the user clicking on "Initiate verifier", instead that's done automatically
  address public Fin4MessagingAddress;
  bool public isNoninteractive = false;

  mapping (address => address) public fin4TokenToItsCreator; // at the same time a register of Fin4Tokens using this verifier type

  constructor(address Fin4MessagingAddr) public {
    Fin4MessagingAddress = Fin4MessagingAddr;
  }

  function getName() public view returns(string memory) {
    return name;
  }

  function getDescription() public view returns(string memory) {
    return description;
  }

  function getInfo() public view returns(string memory, string memory, string memory, bool) {
    return (name, description, getParameterForTokenCreatorToSetEncoded(), isNoninteractive);
  }

  // This method gets overriden by the verifier types and encode the parameter names
  // to be filled by the token creator. He gets prompted to set them in the token creation process
  function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
    return "";
  }

  // Helper method for all verifier types to go through the same method when sending their approvals
  // to the respective claim on a token
  function _sendApprovalNotice(address verifierTypeAddress, address tokenAddrToReceiveVerifierDecision, uint claimId) internal {
    // TODO ensure it can only be called from within this SC?
    Fin4TokenStub(tokenAddrToReceiveVerifierDecision).receiveVerifierApprovalNotice(verifierTypeAddress, claimId);
  }

  function _sendRejectionNotice(address verifierTypeAddress, address tokenAddrToReceiveVerifierDecision, uint claimId) internal {
    Fin4TokenStub(tokenAddrToReceiveVerifierDecision).receiveVerifierRejectionNotice(verifierTypeAddress, claimId);
  }

  function _sendPendingNotice(address verifierTypeAddress, address tokenAddrToReceiveVerifierDecision, uint claimId) internal {
    Fin4TokenStub(tokenAddrToReceiveVerifierDecision).receiveVerifierPendingNotice(verifierTypeAddress, claimId);
  }

  function registerTokenCreator(address tokenCreator) public {
    fin4TokenToItsCreator[msg.sender] = tokenCreator;
  }

  // Used by verifier types that require the token creator to approve something
  function getCreatorOfToken(address tokenAddress) public view returns(address) {
    return fin4TokenToItsCreator[tokenAddress];
  }

  // On purpose not abstract so that deriving classes don't HAVE to implement it
  function autoSubmitProof(address user, address tokenAddrToReceiveVerifierDecision, uint claimId) public {}
  function autoCheck(address user, address tokenAddrToReceiveVerifierDecision, uint claimId) public {}

}
