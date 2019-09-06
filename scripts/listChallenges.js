/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('GOV.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	// e.g. npm run listChallenges
	async function listChallenges() {
		let registryAddress = config.RegistryAddress;

		const registry = await Registry.at(registryAddress);

		await registry
			.getChallenges()
			.then(({ 0: challengeID, 1: rewardPool, 2: challenger, 3: isReview, 4: resolved, 5: totalTokens }) => {
				let challengesObj = {};
				console.log('bla');
				for (var i = 0; i < challengeID.length; i++) {
					challengesObj[i] = {
						challengeID: new BN(challengeID[i]).toString(),
						rewardPool: new BN(rewardPool[i]).toString(),
						challenger: challenger[i],
						isReview: isReview[i],
						resolved: resolved[i],
						totalTokens: new BN(totalTokens[i]).toString()
					};
					//console.log("blabla");
					//console.log(challengesObj)
				}
				console.log(challengesObj);
			});
		return true;
	}

	listChallenges().then(() => done());
};
