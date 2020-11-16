pragma solidity >=0.5.17;

import 'contracts/tokens/ERC20Plus.sol';

contract Campaign {

    string public campaignName;                 // Name of the campaign. Ex - 'City of Munich Campaign'
    address public campaignCreator;             // Person/Organisation that created the campaign     
    string public actionsText;                  // Actions policy i.e. actions that will be rewarded
    uint public campaignStartTime;              // Date and time when the campaign is supposed to start
    uint public campaignEndTime;                // Date and time when the campaign is supposed to end
    address[] allTokens;                        // List of all the tokens part of the campaign ex - clean-isar and plastic-waste token
    uint public successThreshold;               // Number of succesful claims required on tokens
    uint public claimPerCampaignContributor;    // Number of claim(s) a campaign contributor can make for each token in campaign
    uint[] public initialSupplyList;

    constructor(string memory _campaignName, address campaignCreatorAddress, string memory _actionsText, uint _campaignStartTime, uint _campaignEndTime, address[] memory _allTokens, uint _successThreshold, uint _claimPerCampaignContributor) public {
        campaignCreator = campaignCreatorAddress;
        campaignName = _campaignName;
        actionsText = _actionsText;
        campaignStartTime = _campaignStartTime;
        campaignEndTime = _campaignEndTime;
        allTokens = _allTokens;
        successThreshold = _successThreshold;
        claimPerCampaignContributor = _claimPerCampaignContributor;
        getInitialSuppliesOnTokens();
    }

    function getCampaignInfo(address user) public view returns (string memory, bool, string memory, uint, uint, address[] memory, uint, uint) {
        return(campaignName, user == campaignCreator, actionsText, campaignStartTime, campaignEndTime , allTokens, successThreshold, claimPerCampaignContributor);
    }


    function getInitialSuppliesOnTokens() public returns (uint[] memory) {

        for(uint i = 0; i< allTokens.length; i++ ) {
            initialSupplyList.push(ERC20Plus(allTokens[i]).totalSupply());
        }
        return initialSupplyList;
    }  
    
    function totalTokensClaimed() public view returns (uint[] memory, uint) {
        uint sum = 0;
        uint[] memory result = new uint[](initialSupplyList.length);

    
        for(uint i = 0; i < allTokens.length; i++) {
            uint current = ERC20Plus(allTokens[i]).totalSupply() - initialSupplyList[i];
            result[i] = current;
            sum += current;
        }

        return (result, sum);
    }   
    
    function campaignSuccessVerifier() public view returns (bool) {
        uint claimedTokens = 0;
        uint[] memory res;
        
        (res, claimedTokens) = totalTokensClaimed();

        if (claimedTokens >= successThreshold)
            return true;
        else 
            return false;
    } 
}