pragma solidity >=0.5.17;

contract Campaign {

    string public campaignName;                 // Name of the campaign. Ex - 'City of Munich Campaign'
    address public campaignCreator;             // Person/Organisation that created the campaign     
    string public actionsText;                  // Actions policy i.e. actions that will be rewarded
    uint public campaignStartTime;              // Date and time when the campaign is supposed to start
    uint public campaignEndTime;                // Date and time when the campaign is supposed to end
    address[] allTokens;                        // List of all the tokens part of the campaign ex - clean-isar and plastic-waste token
    uint public successThreshold;               // Number of succesful claims required on tokens
    uint public claimPerCampaignContributor;    // Number of claim(s) a campaign contributor can make for each token in campaign

    constructor(string memory _campaignName, address campaignCreatorAddress, string memory _actionsText, uint _campaignStartTime, uint _campaignEndTime, address[] memory _allTokens, uint _successThreshold, uint _claimPerCampaignContributor) public {
        campaignCreator = campaignCreatorAddress;
        campaignName = _campaignName;
        actionsText = _actionsText;
        campaignStartTime = _campaignStartTime;
        campaignEndTime = _campaignEndTime;
        allTokens = _allTokens;
        successThreshold = _successThreshold;
        claimPerCampaignContributor = _claimPerCampaignContributor;
    }

    function getCampaignInfo(address user) public view returns (string memory, bool, string memory, uint, uint, address[] memory, uint, uint) {
        return(campaignName, user == campaignCreator, actionsText, campaignStartTime, campaignEndTime , allTokens, successThreshold, claimPerCampaignContributor);
    }

    function getAllCampaignTokens() public returns (address[] memory) {}   // Function to get all tokens that are part of campaign

    function getInitialSuppliesOnTokens() public returns (uint[] memory) {}  // Get initial supply of all the tokens to calculate diff later

    function totalTokensClaimed() public returns (uint) {}     // Calculate the difference in the total supply of all the campaign token(s)
    
    function campaignSuccessVerifier() public returns (bool) {} // Calculate whether the totalClaimedTokens is equal to the successThreshold

    /* Check that campaign hasn't ended and total number of succesful claims is still less than successThreshold, before submitting any claim */
}