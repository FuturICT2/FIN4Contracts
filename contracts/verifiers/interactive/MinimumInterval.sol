pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";

contract MinimumInterval is Fin4BaseVerifierType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseVerifierType(Fin4MessagingAddress)
    public {
      name = "MinimumInterval";
      description = "Defines a minimum time that has to pass between claims.";
      // minimumInterval = 1 * 24 * 60 * 60 * 1000; // 1 day
    }

    function submitProof_MinimumInterval(address tokenAddrToReceiveVerifierDecision, uint claimId) public {
      if (minimumIntervalRequirementMet(tokenAddrToReceiveVerifierDecision, msg.sender, claimId)) {
        _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierDecision, claimId);
      } else {
        string memory message = string(abi.encodePacked(
          Fin4TokenStub(tokenAddrToReceiveVerifierDecision).name(),
          ": The time between your previous claim and this one is shorter than the minimum required timespan of ",
          uint2str(_getMinimumInterval(tokenAddrToReceiveVerifierDecision) / 1000), "s."
        ));
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), msg.sender, message);
        _sendRejectionNotice(address(this), tokenAddrToReceiveVerifierDecision, claimId);
      }
    }

    function minimumIntervalRequirementMet(address tokenAddressUsingThisverifierType, address claimer, uint claimId) private view returns(bool) {
      /*
      uint timeBetween = Fin4TokenStub(tokenAddressUsingThisverifierType).getTimeBetweenThisClaimAndThatClaimersPreviousOne(claimer, claimId);
      return timeBetween >= _getMinimumInterval(tokenAddressUsingThisverifierType);
      */
      return true; // TODO
    }

    /* // Archived here from Fin4TokenBase
    function getTimeBetweenThisClaimAndThatClaimersPreviousOne(address claimer, uint claimId) public view returns(uint) {
      uint[] memory ids = getClaimIds(claimer);
      if (ids.length < 2 || ids[0] == claimId) {
        return 365 * 24 * 60 * 60 * 1000; // a year as indicator that it's not applicable (can't do -1 unfortunately)
      }
      uint previousId;
      for (uint i = 0; i < ids.length; i ++) {
        if(ids[i] == claimId) {
          return claims[claimId].claimCreationTime - claims[previousId].claimCreationTime;
        }
        previousId = ids[i];
      }
      // TODO fallback return?
    }
    */

    // @Override
    function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:minimumInterval:days";
    }

    mapping (address => uint) public tokenToParameter;

    function setParameters(address token, uint minimumInterval) public {
      // TODO safeguard
      tokenToParameter[token] = minimumInterval;
    }

    /*
    function getParameterizedDescription(address token) public view returns(string memory) {
      return string(abi.encodePacked(
          "The token creator defined the minimum time that has to pass between claims as ",
          uint2str(_getMinimumInterval(token) / (1000 * 60 * 60 * 24)), " days."
        ));
    }*/

    function _getMinimumInterval(address token) private view returns(uint) {
      return tokenToParameter[token] * 24 * 60 * 60 * 1000; // from days to miliseconds
    }

}
