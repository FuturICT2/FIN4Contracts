pragma solidity >=0.5.17;

import 'contracts/campaigns/Campaign.sol';

contract CampaignManagement {

    address[] public allCampaigns;
    address public creator;

    constructor() public {
        creator = msg.sender;
    }

    function registerNewCampaign(address campaignAddress) public {
        allCampaigns.push(campaignAddress);
    }

    function getAllCampaigns() public view returns (address[] memory) { 
        return allCampaigns;
    }

    function getCampaignInfo(address campaignAddr) public view returns (string memory, bool, string memory, uint, uint,
        address[] memory, uint, uint) {
        return Campaign(campaignAddr).getCampaignInfo(msg.sender);
    }

    function getCampaignTokensClaimed(address campaignAddr) public view returns (uint[] memory, uint) {
        return Campaign(campaignAddr).totalTokensClaimed();
    }

    function getCampaignSuccess(address campaignAddr) public view returns (bool) {
        return Campaign(campaignAddr).campaignSuccessVerifier();
    }

}
