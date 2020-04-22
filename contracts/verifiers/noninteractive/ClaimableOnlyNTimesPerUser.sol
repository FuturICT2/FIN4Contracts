pragma solidity ^0.5.0;

import "contracts/verifiers/Fin4BaseVerifierType.sol";

contract ClaimableOnlyNTimesPerUser is Fin4BaseVerifierType {

    constructor(address Fin4MessagingAddress)
    Fin4BaseVerifierType(Fin4MessagingAddress)
    public {
        name = "ClaimableOnlyNTimesPerUser";
        description = "The token creator sets a cap how many times a token can be successfully claimed";
        isNoninteractive = true;
    }

  // @Override
  function autoCheck(address user, address tokenAddrToReceiveVerifierNotice, uint claimId) public {
      // This would allow several parallel claims to go through if they are not approved one after the other
      // have to check when all other verifiers are approved instead // TODO
      uint usersClaimCountOnToken = Fin4TokenStub(tokenAddrToReceiveVerifierNotice).countApprovedClaimsOfThisUser(user);
      uint cap = tokenToClaimsCap[tokenAddrToReceiveVerifierNotice];
      if (usersClaimCountOnToken == cap) {
          string memory message = string(abi.encodePacked(
              "Your claim on token \'",
              Fin4TokenStub(tokenAddrToReceiveVerifierNotice).name(),
              "\' got rejected from the constraint \'ClaimableOnlyNTimesPerUser\' because you reached the",
              " maximum number of successful claims as defined by the token creator: ", uint2str(cap)));
          Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), user, message);
          _sendRejectionNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "");
      } else {
          _sendApprovalNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "");
      }
  }

  // @Override
  function getParameterForTokenCreatorToSetEncoded() public pure returns(string memory) {
      return "uint:max. claims:";
  }

  mapping (address => uint) public tokenToClaimsCap;

  function setParameters(address token, uint claimsCap) public {
      tokenToClaimsCap[token] = claimsCap;
  }

}
