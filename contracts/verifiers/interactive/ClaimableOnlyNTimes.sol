pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";

contract ClaimableOnlyNTimes is Fin4BaseVerifierType {

    constructor(address Fin4MessagingAddress)
    Fin4BaseVerifierType(Fin4MessagingAddress)
    public {
        name = "ClaimableOnlyNTimes";
        description = "The token creator sets a cap how many times a token can be claimed";
        isAutoInitiable = true;
    }

  // @Override
  function autoSubmitProof(address user, address tokenAddrToReceiveVerifierNotice, uint claimId) public {
      uint usersClaimCountOnToken = userToTheirClaimsCountOnToken[user][tokenAddrToReceiveVerifierNotice];
      uint cap = tokenToClaimsCap[tokenAddrToReceiveVerifierNotice];
      if (usersClaimCountOnToken == cap) {
          string memory message = string(abi.encodePacked(
              "Your claim on token \'",
              Fin4TokenStub(tokenAddrToReceiveVerifierNotice).name(),
              "\' got rejected from verifier type \'ClaimableOnlyNTimes\' because you reached the",
              " maximum number of claims as capped by the token creator: ", uint2str(cap)));
          _sendRejectionNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, message);
      } else {
          _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "");
          userToTheirClaimsCountOnToken[user][tokenAddrToReceiveVerifierNotice] = usersClaimCountOnToken + 1;
      }
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
