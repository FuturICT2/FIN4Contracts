pragma solidity ^0.5.17;

import "contracts/verifiers/onchain/social/SpecificAddress.sol";

contract Picture is SpecificAddress {

    constructor() public  {}

    // @Override
    function init() public {
        name = "Picture";
        description = "The claimer has to supply a picture, based on which the approver will decide to approve.";
    }

    function submitProof_Picture(address tokenAddrToReceiveVerifierNotice, uint claimId, address claimer, address approver, string memory IPFShash) public {
        // TODO minimize duplicate code by reusing super method
        PendingApproval memory pa;
        pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = claimer;
        pa.approver = approver;
        pa.attachment = IPFShash;
        pa.pendingApprovalId = pendingApprovals[approver].length;
        string memory message = string(abi.encodePacked(getMessageText(),
            Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name()));
        pa.messageId = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(
            claimer, name, approver, message, IPFShash, pa.pendingApprovalId);
        pendingApprovals[approver].push(pa);
        _sendPendingNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId);
    }

    // @Override
    function getMessageText() public pure returns(string memory) {
        // TODO include the quantity into the message
        return "Please check this picture verifier and approve the correct amount of this token: ";
    }

}
