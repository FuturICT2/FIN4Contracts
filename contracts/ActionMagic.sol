pragma solidity ^0.5.0;

contract ActionMagic {

  address public actionGiver;
  address public actionReceiver;
  bool public claimInitiatedByActionGiver = false;
  bool public claimApprovedByActionReceiver = false;

  // register as actionGiver
  function becomeActionGiver() public returns (bool) {
    actionGiver = msg.sender;
    return true;
  }

  // register as actionReceiver
  function becomeActionReceiver() public returns (bool) {
    actionReceiver = msg.sender;
    return true;
  }

  function actionGiverInitiatesClaim() public returns (bool) {
    require(msg.sender == actionGiver);
    claimInitiatedByActionGiver = true;
    return true;
  }

  function actionReceiverApprovesClaim() public returns (bool) {
    require(msg.sender == actionReceiver && claimInitiatedByActionGiver);
    claimApprovedByActionReceiver = true;
    claimInitiatedByActionGiver = false;
    return true;
  }

  // expected to get called regularly from all involved parties
  function updatePolling() public view returns (string memory) {
    if(msg.sender == actionReceiver && claimInitiatedByActionGiver) {
      return "Do you approve the claim?";
    }
    if(msg.sender == actionGiver) {
      if (claimApprovedByActionReceiver) {
        return "Your claim got approved.";
      } else {
        return "Your claim did not get approved yet.";
      }
    }
  }

}
