pragma solidity ^0.5.17;

import "contracts/verifiers/interactive/SpecificAddress.sol";

contract PictureSelfChosenApprover is SpecificAddress {

    constructor() public  {}

    // @Override
    function init() public {
        name = "sc.verifier.picture-self-chosen-approver.name";
        description = "sc.verifier.picture-self-chosen-approver.description";
    }

    function submitProof_Picture(address tokenAddrToReceiveVerifierNotice, uint claimId, address approver, string memory IPFShash) public {
        require(msg.sender != approver, "Self-approval is not allowed.");
        // TODO minimize duplicate code by reusing super method
        PendingApproval memory pa;
        pa.tokenAddrToReceiveVerifierNotice = tokenAddrToReceiveVerifierNotice;
        pa.claimIdOnTokenToReceiveVerifierDecision = claimId;
        pa.requester = msg.sender;
        pa.approver = approver;
        pa.attachment = IPFShash;
        pa.pendingApprovalId = pendingApprovals[approver].length;
        string memory message = string(abi.encodePacked(getMessageText(),
            Fin4TokenBase(tokenAddrToReceiveVerifierNotice).name()));
        pa.messageId = Fin4Messaging(Fin4MessagingAddress).addPendingRequestMessage(
            msg.sender, contractName, approver, message, IPFShash, pa.pendingApprovalId);
        pendingApprovals[approver].push(pa);
        _sendPendingNotice(address(this), tokenAddrToReceiveVerifierNotice, claimId, "Your approver has been notified about the request.");
    }

    // @Override
    function getMessageText() public pure returns(string memory) {
        // TODO include the quantity into the message
        return "Please check this picture verifier and approve the correct amount of this token: ";
    }

}
