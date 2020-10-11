pragma solidity >=0.5.17;

import 'contracts/campaigns/Campaign.sol';

contract CampaignManagement {

    address[] public allCampaigns;
    address public creator;


    constructor() public {
        creator = msg.sender;
    }

    function registerNewCampaign(address campaignAddress) public {              // Register a new campaign
        allCampaigns.push(campaignAddress);
    }

    function getAllCampaigns() public view returns (address[] memory) {             // Get list of all campaigns
        return allCampaigns;
    }

    function getCampaignInfo(address campaignAddr) public view returns (string memory, bool, string memory, uint, uint, address[] memory, uint, uint) {
        return Campaign(campaignAddr).getCampaignInfo(msg.sender);
    }
}