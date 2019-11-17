pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract ClaimableOnlyNTimes is Fin4BaseProofType {

    constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "ClaimableOnlyNTimes";
      description = "The token creator sets a cap how many times a token can be claimed";
    }

  function submitProof_ClaimableOnlyNTimes(address tokenAddrToReceiveProof, uint claimId) public returns(bool) {
      // TODO
  }

  // @Override
  function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:max. claims:";
  }

  mapping (address => uint) public tokenToClaimsCap;
  mapping (address => mapping (address => uint)) public userToTheirClaimsCountOnToken; // user, token, claims count

  function setParameters(address token, uint claimsCap) public {
      tokenToClaimsCap[token] = claimsCap;
  }

}
