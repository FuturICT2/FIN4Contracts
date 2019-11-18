pragma solidity ^0.5.0;

import "contracts/proof/Fin4BaseProofType.sol";
import "contracts/Fin4Proofing.sol";
import "contracts/Fin4TokenBase.sol";

contract Networking is Fin4BaseProofType {

  constructor(address Fin4MessagingAddress)
    Fin4BaseProofType(Fin4MessagingAddress)
    public {
      name = "Networking";
      description = "Submit content of your networking activity and your counterpart has to approve your claim.";
    }

    address public Fin4ProofingAddress;

    function setFin4ProofingAddress(address Fin4ProofingAddr) public {
        Fin4ProofingAddress = Fin4ProofingAddr;
    }

    struct PendingApproval {
        uint pendingApprovalId;
        address tokenAddrToReceiveProof;
        uint claimIdOnTokenToReceiveProof;
        address requester;
        address approver;
        string attachment;
        uint messageId;
        bool isApproved;
        uint timestamp;
    }

    mapping (address => PendingApproval[]) public pendingApprovals;

    function submitProof(address tokenAddrToReceiveProof, uint claimId, address approver, string memory content) public {
        PendingApproval memory pa;
        pa.tokenAddrToReceiveProof = tokenAddrToReceiveProof;
        pa.claimIdOnTokenToReceiveProof = claimId;
        pa.requester = msg.sender;
        pa.approver = approver;
        pa.pendingApprovalId = pendingApprovals[approver].length;
        pa.timestamp = now;
        pa.attachment = content;

        string memory message = string(abi.encodePacked(
            "You were requested to approve a networking claim on the token '",
            Fin4TokenBase(tokenAddrToReceiveProof).name(),
            "'. The submitted content is '", content, "'."));

        pa.messageId = Fin4Messaging(Fin4MessagingAddress).addPendingApprovalMessage(
            msg.sender, name, approver, message, content, pa.pendingApprovalId);

        pendingApprovals[approver].push(pa);
    }

    function receiveApprovalFromSpecificAddress(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
        require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
        Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);
        _sendApproval(address(this), pa.tokenAddrToReceiveProof, pa.claimIdOnTokenToReceiveProof);
        Fin4Proofing(Fin4ProofingAddress).addSubmission(address(this), pa.tokenAddrToReceiveProof, pa.requester, pa.timestamp, 0, pa.attachment);
    }

    function receiveRejectionFromSpecificAddress(uint pendingApprovalId) public {
        PendingApproval memory pa = pendingApprovals[msg.sender][pendingApprovalId];
        require(pa.approver == msg.sender, "This address is not registered as approver for this pending approval");
        Fin4Messaging(Fin4MessagingAddress).markMessageAsActedUpon(msg.sender, pa.messageId);
        string memory message = string(abi.encodePacked("Your chosen approver '", addressToString(pa.approver),
            "' has rejected your approval request for the 'Networking' proof on a claim on token '",
            Fin4TokenBase(pa.tokenAddrToReceiveProof).name(), "'"));
        Fin4Messaging(Fin4MessagingAddress).addInfoMessage(address(this), pa.requester, message);
        _sendRejection(address(this), pa.tokenAddrToReceiveProof, pa.claimIdOnTokenToReceiveProof);
    }
}
