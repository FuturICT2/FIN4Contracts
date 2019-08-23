/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('ERC20Plus.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function listChallenges() {
		let registryAddress = config.RegistryAddress;
		let fin4MainAddress = config.Fin4MainAddress;
		let PLCRVotingAddress = config.PLCRVotingAddress;

		/* eslint-disable no-console */
		console.log('Using RegistryFactory at:');
		console.log(`     ${registryAddress}`);
		console.log('Using PLCR at:');
		console.log(`     ${PLCRVotingAddress}`);
		console.log('Using Fin4Main at:');
		console.log(`     ${fin4MainAddress}`);
		console.log('');
		console.log('Deploying proxy contracts...');
		console.log('...');
		/* eslint-enable no-console */

		const registry = await Registry.at(registryAddress);
		const plcr = await PLCRVoting.at(PLCRVotingAddress);

		await registry
			.getListings()
			.then(({ 0: challengeID, 1: rewardPool, 2: challenger, 3: isReview, 4: stake, 5: totalTokens }) => {
				let listingsObj = {};
				for (var i = 0; i < listingsKeys.length; i++) {
					challengesObj[address] = {
						challengeID: challengeID[i],
						rewardPool: rewardPool[i],
						challenger: challenger[i],
						isReview: isReview[i],
						stake: stake[i],
						totalTokens: totalTokens[i]
					};
				}
				console.log(challenges);
			});
		return true;
	}

	listChallenges().then(() => done());
};
