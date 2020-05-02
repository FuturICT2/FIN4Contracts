pragma solidity ^0.5.17;

import "../tokens/GOV.sol";
import "./Parameterizer.sol";
import "./PLCR/PLCRVoting.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Registry {

    // ------
    // EVENTS
    // ------

    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, string data, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint commitEndDate, uint revealEndDate, address indexed challenger);
    event _Review(bytes32 indexed listingHash, uint reviewID, uint commitEndDate, uint revealEndDate);   
    event _Deposit(bytes32 indexed listingHash, uint added, uint newTotal, address indexed owner);
    event _Withdrawal(bytes32 indexed listingHash, uint withdrew, uint newTotal, address indexed owner);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ApplicationRemoved(bytes32 indexed listingHash);
    event _ListingRemoved(bytes32 indexed listingHash);
    event _ListingWithdrawn(bytes32 indexed listingHash, address indexed owner);
    event _TouchAndRemoved(bytes32 indexed listingHash);
    event _ChallengeFailed(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens);
    event _ChallengeSucceeded(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens);
    event _RewardClaimed(uint indexed challengeID, uint reward, address indexed voter);
    event _ExitInitialized(bytes32 indexed listingHash, uint exitTime, uint exitDelayEndDate, address indexed owner);

    using SafeMath for uint;

    struct Listing {
        uint applicationExpiry; // Expiration date of apply stage
        bool whitelisted;       // Indicates registry status
        address owner;          // Owner of Listing
        uint unstakedDeposit;   // Number of tokens in the listing not locked in a challenge
        uint challengeID;       // Corresponds to a PollID in PLCRVoting
	    uint exitTime;		// Time the listing may leave the registry
        uint exitTimeExpiry;    // Expiration date of exit period
    }

    struct Challenge {
        uint rewardPool;        // (remaining) Pool of tokens to be distributed to winning voters
        address challenger;     // Owner of Challenge
        bool resolved;          // Indication of if challenge is resolved
        bool isReview;
        uint stake;             // Number of tokens at stake for either party during challenge
        uint totalTokens;       // (remaining) Number of tokens used in voting by the winning side
        mapping(address => bool) tokenClaims; // Indicates whether a voter has claimed a reward yet
    }

    // Maps challengeIDs to associated challenge data
    uint[] private challengesIndexes;
    mapping(uint => Challenge) public challenges;

    // Maps listingHashes to associated listingHash data
    bytes32[] private listingsIndexes;
    mapping(bytes32 => Listing) public listings;

    // Global Variables
    GOV public token;
    PLCRVoting public voting;
    Parameterizer public parameterizer;
    string public name;

    /**
    @dev Initializer. Can only be called once.
    @param _token The address where the GOV token contract is deployed
    */
    function init(address _token, address _voting, address _parameterizer, string memory _name) public {
        require(_token != address(0) && address(token) == address(0));
        require(_voting != address(0) && address(voting) == address(0));
        require(_parameterizer != address(0) && address(parameterizer) == address(0));

        token = GOV(_token);
        voting = PLCRVoting(_voting);
        parameterizer = Parameterizer(_parameterizer);
        name = _name;
    }

    // --------------------
    // PUBLISHER INTERFACE:
    // --------------------

    /**
    @dev                Allows a user to start an application. Takes tokens from user and sets
                        apply stage end time.
    @param tokenAddress The hash of a potential listing a user is applying to add to the registry // TODO adapt comment
    @param _amount      The number of GOV tokens a user is willing to potentially stake
    @param _data        Extra data relevant to the application. Think IPFS hashes.
    */
    function applyToken(address tokenAddress, uint _amount, string calldata _data) external {
        // conversion to bytes32 added (Sergiu)
        bytes32 _listingHash = bytes32(uint256(tokenAddress)); // convert back via address adr = address(uint160(uint256(test))), from https://ethereum.stackexchange.com/a/68358 and https://ethereum.stackexchange.com/a/41356
        //
        require(!isWhitelisted(_listingHash), "listingHash is not whitelisted");
        require(!appWasMade(_listingHash), "app was not made for listingHash");
        require(_amount >= parameterizer.get("minDeposit") + parameterizer.get("reviewTax"), "amount is smaller then minDeposit + reviewTax");

        // Sets owner
        listingsIndexes.push(_listingHash);
        Listing storage listing = listings[_listingHash];
        listing.owner = msg.sender;

        // Sets apply stage end time
        listing.applicationExpiry = block.timestamp.add(parameterizer.get("applyStageLen"));
        listing.unstakedDeposit = _amount;

        // Transfers tokens from user to Registry contract
        require(GOV(token).transferFrom(listing.owner, address(this), _amount), "Failed to transfer tokens from user to Registry contract");

        review(_listingHash);

        emit _Application(_listingHash, _amount, listing.applicationExpiry, _data, msg.sender);
    }

    /**
    @dev                Allows the owner of a listingHash to increase their unstaked deposit.
    @param _listingHash A listingHash msg.sender is the owner of
    @param _amount      The number of GOV tokens to increase a user's unstaked deposit
    */
    function deposit(bytes32 _listingHash, uint _amount) external {
        Listing storage listing = listings[_listingHash];

        require(listing.owner == msg.sender);

        listing.unstakedDeposit += _amount;
        require(GOV(token).transferFrom(msg.sender, address(this), _amount));

        emit _Deposit(_listingHash, _amount, listing.unstakedDeposit, msg.sender);
    }

    /**
    @dev                Allows the owner of a listingHash to decrease their unstaked deposit.
    @param _listingHash A listingHash msg.sender is the owner of.
    @param _amount      The number of GOV tokens to withdraw from the unstaked deposit.
    */
    function withdraw(bytes32 _listingHash, uint _amount) external {
        Listing storage listing = listings[_listingHash];

        require(listing.owner == msg.sender);
        require(_amount <= listing.unstakedDeposit);
        require(listing.unstakedDeposit - _amount >= parameterizer.get("minDeposit"));

        listing.unstakedDeposit -= _amount;
        require(token.transfer(msg.sender, _amount));

        emit _Withdrawal(_listingHash, _amount, listing.unstakedDeposit, msg.sender);
    }

    /**
    @dev		Initialize an exit timer for a listing to leave the whitelist
    @param _listingHash	A listing hash msg.sender is the owner of
    */
    function initExit(bytes32 _listingHash) external {
        Listing storage listing = listings[_listingHash];

        require(msg.sender == listing.owner);
        require(isWhitelisted(_listingHash));
        // Cannot exit during ongoing challenge
        require(listing.challengeID == 0 || challenges[listing.challengeID].resolved);

        // Ensure user never initializedExit or exitPeriodLen passed
        require(listing.exitTime == 0 || now > listing.exitTimeExpiry);

        // Set when the listing may be removed from the whitelist
        listing.exitTime = now.add(parameterizer.get("exitTimeDelay"));
	    // Set exit period end time
	    listing.exitTimeExpiry = listing.exitTime.add(parameterizer.get("exitPeriodLen"));
        emit _ExitInitialized(_listingHash, listing.exitTime, listing.exitTimeExpiry, msg.sender);
    }

    /**
    @dev		Allow a listing to leave the whitelist
    @param _listingHash A listing hash msg.sender is the owner of
    */
    function finalizeExit(bytes32 _listingHash) external {
        Listing storage listing = listings[_listingHash];

        require(msg.sender == listing.owner);
        require(isWhitelisted(_listingHash));
        // Cannot exit during ongoing challenge
        require(listing.challengeID == 0 || challenges[listing.challengeID].resolved);

        // Make sure the exit was initialized
        require(listing.exitTime > 0);
        // Time to exit has to be after exit delay but before the exitPeriodLen is over
	    require(listing.exitTime < now && now < listing.exitTimeExpiry);

        resetListing(_listingHash);
        emit _ListingWithdrawn(_listingHash, msg.sender);
    }

    // -----------------------
    // TOKEN HOLDER INTERFACE:
    // -----------------------

    /**
    @dev                Starts a poll for a listingHash which is already in the whitelist.
                        Tokens are taken from the challenger and the applicant's deposits are locked.
    @param _listingHash The listingHash being challenged, whether listed or in application
    @param _data        Extra data relevant to the challenge. Think IPFS hashes.
    */
    function challenge(bytes32 _listingHash, string calldata _data) external returns (uint challengeID) {
        Listing storage listing = listings[_listingHash];
        uint minDeposit = parameterizer.get("minDeposit");

        // Listing must be in apply stage or already on the whitelist
        require(appWasMade(_listingHash) || listing.whitelisted);
        // Prevent multiple challenges
        require(listing.challengeID == 0 || challenges[listing.challengeID].resolved);

        if (listing.unstakedDeposit < minDeposit) {
            // Not enough tokens, listingHash auto-delisted
            resetListing(_listingHash);
            emit _TouchAndRemoved(_listingHash);
            return 0;
        }

        // Starts poll
        uint pollID = voting.startPoll(
            parameterizer.get("challengeVoteQuorum"),
            parameterizer.get("commitStageLen"),
            parameterizer.get("revealStageLen")
        );

        uint oneHundred = 100; // Kludge that we need to use SafeMath
        challenges[pollID] = Challenge({
            challenger: msg.sender,
            rewardPool: ((oneHundred.sub(parameterizer.get("dispensationPct"))).mul(minDeposit)).div(100),
            stake: minDeposit,
            resolved: false,
            isReview: false,
            totalTokens: 0
        });
        challengesIndexes.push(pollID);
        // Updates listingHash to store most recent challenge
        listing.challengeID = pollID;

        // Locks tokens for listingHash during challenge
        listing.unstakedDeposit -= minDeposit;

        // Takes tokens from challenger
        require(GOV(token).transferFrom(msg.sender, address(this), minDeposit));

        (uint commitEndDate, uint revealEndDate,,,) = voting.pollMap(pollID);

        emit _Challenge(_listingHash, pollID, _data, commitEndDate, revealEndDate, msg.sender);
        return pollID;
    }

    /**
    @dev                Updates a listingHash's status from 'application' to 'listing' or resolves
                        a challenge if one exists.
    @param _listingHash The listingHash whose status is being updated
    */
    function updateStatus(bytes32 _listingHash) public {
        if (canBeWhitelisted(_listingHash)) {
            whitelistApplication(_listingHash);
        } else if (challengeCanBeResolved(_listingHash)) {
            resolveChallenge(_listingHash);
        } else {
            revert("Nothing to update");
        }
    }

    /**
    @dev                  Updates an array of listingHashes' status from 'application' to 'listing' or resolves
                          a challenge if one exists.
    @param _listingHashes The listingHashes whose status are being updated
    */
    function updateStatuses(bytes32[] memory _listingHashes) public {
        // loop through arrays, revealing each individual vote values
        for (uint i = 0; i < _listingHashes.length; i++) {
            updateStatus(_listingHashes[i]);
        }
    }

    // ----------------
    // TOKEN FUNCTIONS:
    // ----------------

    /**
    @dev                Called by a voter to claim their reward for each completed vote. Someone
                        must call updateStatus() before this can be called.
    @param _challengeID The PLCR pollID of the challenge a reward is being claimed for
    */
    function claimReward(uint _challengeID) public {
        Challenge storage challengeInstance = challenges[_challengeID];
        // Ensures the voter has not already claimed tokens and challengeInstance results have
        // been processed
        require(challengeInstance.tokenClaims[msg.sender] == false);
        require(challengeInstance.resolved == true);

        uint voterTokens = voting.getNumPassingTokens(msg.sender, _challengeID);
        uint reward = voterTokens.mul(challengeInstance.rewardPool)
                      .div(challengeInstance.totalTokens);

        // Subtracts the voter's information to preserve the participation ratios
        // of other voters compared to the remaining pool of rewards
        challengeInstance.totalTokens -= voterTokens;
        challengeInstance.rewardPool -= reward;

        // Ensures a voter cannot claim tokens again
        challengeInstance.tokenClaims[msg.sender] = true;

        require(token.transfer(msg.sender, reward));

        emit _RewardClaimed(_challengeID, reward, msg.sender);
    }

    /**
    @dev                 Called by a voter to claim their rewards for each completed vote. Someone
                         must call updateStatus() before this can be called.
    @param _challengeIDs The PLCR pollIDs of the challenges rewards are being claimed for
    */
    function claimRewards(uint[] memory _challengeIDs) public {
        // loop through arrays, claiming each individual vote reward
        for (uint i = 0; i < _challengeIDs.length; i++) {
            claimReward(_challengeIDs[i]);
        }
    }

    // --------
    // GETTERS:
    // --------

    /**
    @dev                Calculates the provided voter's token reward for the given poll.
    @param _voter       The address of the voter whose reward balance is to be returned
    @param _challengeID The pollID of the challenge a reward balance is being queried for
    @return             The uint indicating the voter's reward
    */
    function voterReward(address _voter, uint _challengeID)
    public view returns (uint) {
        uint totalTokens = challenges[_challengeID].totalTokens;
        uint rewardPool = challenges[_challengeID].rewardPool;
        uint voterTokens = voting.getNumPassingTokens(_voter, _challengeID);
        return voterTokens.mul(rewardPool).div(totalTokens);
    }

    /**
    @dev                Determines whether the given listingHash be whitelisted.
    @param _listingHash The listingHash whose status is to be examined
    */
    function canBeWhitelisted(bytes32 _listingHash) public view returns (bool) {
        uint challengeID = listings[_listingHash].challengeID;

        // Ensures that the application was made,
        // the application period has ended,
        // the listingHash can be whitelisted,
        // and either: the challengeID == 0, or the challenge has been resolved.
        if (
            appWasMade(_listingHash) &&
            listings[_listingHash].applicationExpiry < now &&
            !isWhitelisted(_listingHash) &&
            (challengeID == 0 || challenges[challengeID].resolved == true)
        ) {
            return true;
        }

        return false;
    }

    /**
    @dev                Returns true if the provided listingHash is whitelisted
    @param _listingHash The listingHash whose status is to be examined
    */
    function isWhitelisted(bytes32 _listingHash) public view returns (bool whitelisted) {
        return listings[_listingHash].whitelisted;
    }

    /**
    @dev                Returns true if apply was called for this listingHash
    @param _listingHash The listingHash whose status is to be examined
    */
    function appWasMade(bytes32 _listingHash) public view returns (bool exists) {
        return listings[_listingHash].applicationExpiry > 0;
    }

    /**
    @dev                Returns true if the application/listingHash has an unresolved challenge
    @param _listingHash The listingHash whose status is to be examined
    */
    function challengeExists(bytes32 _listingHash) public view returns (bool) {
        uint challengeID = listings[_listingHash].challengeID;

        return (listings[_listingHash].challengeID > 0 && !challenges[challengeID].resolved);
    }

    /**
    @dev                Determines whether voting has concluded in a challenge for a given
                        listingHash. Throws if no challenge exists.
    @param _listingHash A listingHash with an unresolved challenge
    */
    function challengeCanBeResolved(bytes32 _listingHash) public view returns (bool) {
        uint challengeID = listings[_listingHash].challengeID;

        require(challengeExists(_listingHash));

        return voting.pollEnded(challengeID);
    }

    /**
    @dev                Determines the number of tokens awarded to the winning party in a challenge.
    @param _challengeID The challengeID to determine a reward for
    */
    function determineReward(uint _challengeID) public view returns (uint) {
        require(!challenges[_challengeID].resolved && voting.pollEnded(_challengeID));

        if (challenges[_challengeID].isReview) {
            return challenges[_challengeID].stake;
        }

        // Edge case, nobody voted, give all tokens to the challenger.
        if (voting.getTotalNumberOfTokensForWinningOption(_challengeID) == 0) {
            return 2 * challenges[_challengeID].stake;
        }

        return (2 * challenges[_challengeID].stake) - challenges[_challengeID].rewardPool;
    }

    /**
    @dev                Getter for Challenge tokenClaims mappings
    @param _challengeID The challengeID to query
    @param _voter       The voter whose claim status to query for the provided challengeID
    */
    function tokenClaims(uint _challengeID, address _voter) public view returns (bool) {
        return challenges[_challengeID].tokenClaims[_voter];
    }

    /**
    @dev Getter for easy handling of listings in the Front-End
    */
    function getListings () public view returns (bytes32[] memory, uint[] memory,
    bool[] memory, address[] memory, uint[] memory, uint[] memory) {
        uint[] memory applicationExpiries = new uint[](listingsIndexes.length);
        bool[] memory whitelistees = new bool[](listingsIndexes.length);
        address[] memory owners = new address[](listingsIndexes.length);
        uint[] memory unstakedDeposits = new uint[](listingsIndexes.length);
        uint[] memory challengeIDs = new uint[](listingsIndexes.length);
	    uint[] memory exitTimes = new uint[](listingsIndexes.length);
        uint[] memory exitTimeExpiries = new uint[](listingsIndexes.length);

        for (uint i = 0; i < listingsIndexes.length; i++) {
            Listing memory lst = listings[listingsIndexes[i]];
            applicationExpiries[i] = lst.applicationExpiry;
            whitelistees[i] = lst.whitelisted;
            owners[i] = lst.owner;
            unstakedDeposits[i] = lst.unstakedDeposit;
            challengeIDs[i] = lst.challengeID;
            exitTimes[i] = lst.exitTime;
            exitTimeExpiries[i] = lst.exitTimeExpiry;
        }
        return (listingsIndexes, applicationExpiries, whitelistees, owners,
            unstakedDeposits, challengeIDs);
    }

    /**
    @dev Gets only the listingKeys from whitelisted listings, for easy display in frontend token lists which are curated
    */
    function getWhitelistedListingKeys() public view returns (bytes32[] memory) {
        uint count = 0;
        for (uint i = 0; i < listingsIndexes.length; i++) {
            if (listings[listingsIndexes[i]].whitelisted) {
                count ++;
            }
        }
        bytes32[] memory whitelistedListingKeys = new bytes32[](count);
        count = 0;
        for (uint i = 0; i < listingsIndexes.length; i++) {
            if (listings[listingsIndexes[i]].whitelisted) {
                whitelistedListingKeys[count] = listingsIndexes[i];
                count ++;
            }
        }
        return whitelistedListingKeys;
    }

    /**
    @dev Getter for easy handling of Challenges in the Front-End
    */
    function getChallenges () public view returns (uint[] memory, uint[] memory,
    address[] memory, bool[] memory, bool[] memory, uint[] memory) {
        uint[] memory challengeID = new uint[](challengesIndexes.length);
        uint[] memory rewardPool = new uint[](challengesIndexes.length);
        address[] memory challenger = new address[](challengesIndexes.length);
        bool[] memory isReview = new bool[](challengesIndexes.length);
        bool[] memory resolved = new bool[](challengesIndexes.length);
	    uint[] memory totalTokens = new uint[](challengesIndexes.length);

        for (uint i = 0; i < challengesIndexes.length; i++){
            Challenge memory lst = challenges[challengesIndexes[i]];
            challengeID[i] = challengesIndexes[i];
            rewardPool[i] = lst.rewardPool;
            challenger[i] = lst.challenger;
            isReview[i] = lst.isReview;
            resolved[i] = lst.resolved;
            totalTokens[i] = lst.totalTokens;
        }
        return (challengeID, rewardPool, challenger, isReview,
            resolved, totalTokens);
    }

    /**
    @dev Getter used for testing
    */
    function whoAmI() public view returns (address) {
        return msg.sender;
    }

    // ----------------
    // PRIVATE FUNCTIONS:
    // ----------------

/**
    @dev Starts a poll for a listingHash which is in the apply stage.
    @param _listingHash The listingHash being reviewed
    */
    function review(bytes32 _listingHash) internal returns (uint reviewID) {
        Listing storage listing = listings[_listingHash];
        uint reviewTax = parameterizer.get("reviewTax");
        uint minDeposit = parameterizer.get("minDeposit");

        // Starts poll
        uint pollID = voting.startPoll(
            parameterizer.get("reviewVoteQuorum"),
            parameterizer.get("applyStageLen").div(2),
            parameterizer.get("applyStageLen").div(2)
        );

        challenges[pollID] = Challenge({
            challenger: msg.sender,
            rewardPool: reviewTax,
            stake: minDeposit,
            resolved: false,
            isReview: true,
            totalTokens: 0
        });
        challengesIndexes.push(pollID);
        // Updates listingHash to store most recent challenge
        listing.challengeID = pollID;

        // Locks tokens for listingHash during challenge
        listing.unstakedDeposit -= parameterizer.get("minDeposit");
        listing.unstakedDeposit -= reviewTax;

        (uint commitEndDate, uint revealEndDate,,,) = voting.pollMap(pollID);

        emit _Review(_listingHash, pollID, commitEndDate, revealEndDate);
        return pollID;
    }

    /**
    @dev                Determines the winner in a challenge. Rewards the winner tokens and
                        either whitelists or de-whitelists the listingHash.
    @param _listingHash A listingHash with a challenge that is to be resolved
    */
    function resolveChallenge(bytes32 _listingHash) private {
        uint challengeID = listings[_listingHash].challengeID;

        // Calculates the winner's reward,
        // which is: (winner's full stake) + (dispensationPct * loser's stake)
        uint reward = determineReward(challengeID);

        // Sets flag on challenge being processed
        challenges[challengeID].resolved = true;

        // Stores the total tokens used for voting by the winning side for reward purposes
        challenges[challengeID].totalTokens = voting.getTotalNumberOfTokensForWinningOption(challengeID);

        // Remove the challenge index
        removeChallengeIndex(challengeID);

        // Case: challenge failed
        if (voting.isPassed(challengeID)) {
            whitelistApplication(_listingHash);
            // Unlock stake so that it can be retrieved by the applicant
            listings[_listingHash].unstakedDeposit += reward;
            if (!challenges[challengeID].isReview){
                emit _ChallengeFailed(_listingHash, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
            }
        }
        // Case: challenge succeeded or nobody voted
        else {
            resetListing(_listingHash);
            if(challenges[challengeID].isReview){
                // If Review, add reward to the voter's rewardpool
                challenges[challengeID].rewardPool += reward;
            } else {
                // Transfer the reward to the challenger
                require(token.transfer(challenges[challengeID].challenger, reward));
            }

            emit _ChallengeSucceeded(_listingHash, challengeID, challenges[challengeID].rewardPool, challenges[challengeID].totalTokens);
        }
    }

    /**
    @dev                Called by updateStatus() if the applicationExpiry date passed without a
                        challenge being made. Called by resolveChallenge() if an
                        application/listing beat a challenge.
    @param _listingHash The listingHash of an application/listingHash to be whitelisted
    */
    function whitelistApplication(bytes32 _listingHash) private {
        if (!listings[_listingHash].whitelisted) {
            emit _ApplicationWhitelisted(_listingHash);
        }
        listings[_listingHash].whitelisted = true;
    }

    /**
    @dev                Deletes a listingHash from the whitelist and transfers tokens back to owner
    @param _listingHash The listing hash to delete
    */
    function resetListing(bytes32 _listingHash) private {
        Listing storage listing = listings[_listingHash];


        // Emit events before deleting listing to check whether is whitelisted
        if (listing.whitelisted) {
            emit _ListingRemoved(_listingHash);
        } else {
            emit _ApplicationRemoved(_listingHash);
        }

        // Deleting listing to prevent reentry
        address owner = listing.owner;
        uint unstakedDeposit = listing.unstakedDeposit;
        delete listings[_listingHash];
        removeListingIndex(_listingHash);

        // Transfers any remaining balance back to the owner
        if (unstakedDeposit > 0) {
            require(token.transfer(owner, unstakedDeposit));
        }
    }
    /**
    @dev                Deletes entry from the listingIndex
    @param _listingHash The listing hash to delete
    */
    function removeListingIndex(bytes32 _listingHash) private {
        for (uint i = 0; i<listingsIndexes.length-1; i++){
            if (listingsIndexes[i] == _listingHash) {
                for (uint j = i; j<listingsIndexes.length-1; j++){
                    listingsIndexes[j] = listingsIndexes[j+1];
                }
                delete listingsIndexes[listingsIndexes.length-1];
                listingsIndexes.length--;
                break;
            }
        }
    }

    /**
    @dev                Deletes entry from the listingIndex
    @param _challengeID The listing hash to delete
    */
    function removeChallengeIndex(uint _challengeID) private {
        for (uint i = 0; i<challengesIndexes.length-1; i++){
            if (challengesIndexes[i] == _challengeID) {
                for (uint j = i; j<challengesIndexes.length-1; j++){
                    challengesIndexes[j] = challengesIndexes[j+1];
                }
                delete challengesIndexes[challengesIndexes.length-1];
                challengesIndexes.length--;
                break;
            }
        }
    }
}
