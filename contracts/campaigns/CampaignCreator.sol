pragma solidity >=0.5.17;

import 'contracts/campaigns/Campaign.sol';
import 'contracts/campaigns/CampaignManagement.sol';

contract CampaignCreator {

    address public campaignManagementAddress;

    constructor(address _campaignManagementAddress) public {
        campaignManagementAddress = _campaignManagementAddress;
    }

    function createNewCampaign(string memory _campaignName, address campaignCreatorAddress, string memory _actionsText, uint _campaignStartTime,
        uint _campaignEndTime, address[] memory _allTokens, uint _successThreshold, uint _claimPerCampaignContributor) public {
        Campaign campaign = new Campaign(_campaignName, campaignCreatorAddress, _actionsText, _campaignStartTime, _campaignEndTime,
            _allTokens, _successThreshold, _claimPerCampaignContributor);
        CampaignManagement(campaignManagementAddress).registerNewCampaign(address(campaign));
    }
}
