pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";

contract ClaimableOnlyNTimesPerUser is Fin4BaseProofType {

    constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
        name = "ClaimableOnlyNTimesPerUser";
        description = "The token creator sets a cap how many times a token can be successfully claimed";
        isConstraint = true;
    }

  // @Override
  function autoCheck(address user, address tokenAddrToReceiveProof, uint claimId) public {
      uint usersClaimCountOnToken = 0;

      // TODO count via for loop on token

      uint cap = tokenToClaimsCap[tokenAddrToReceiveProof];
      if (usersClaimCountOnToken == cap) {
          string memory message = string(abi.encodePacked(
              "Your claim on token \'",
              Fin4TokenStub(tokenAddrToReceiveProof).name(),
              "\' got rejected from the constraint \'ClaimableOnlyNTimesPerUser\' because you reached the",
              " maximum number of successful claims as defined by the token creator: ", uint2str(cap)));
          Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), user, message);
          _sendRejection(address(this), tokenAddrToReceiveProof, claimId);
      } else {
          _sendApproval(address(this), tokenAddrToReceiveProof, claimId);
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
