pragma solidity >=0.5.17;

import 'contracts/tokens/ERC20Plus.sol';

contract Campaign {

    string public campaignName;             
    address public campaignCreator;   
    string public actionsText; 
    uint public campaignStartTime;
    uint public campaignEndTime;
    address[] allTokens; 
    uint public successThreshold; 
    uint public claimPerCampaignContributor; 
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

    // TO-DO: automate minting of campaign token
}