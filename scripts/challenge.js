/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('GOV.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function deployProxies() {
		let registryAddress = config.RegistryAddress;
		let PLCRVotingAddress = config.PLCRVotingAddress;

		const registry = await Registry.at(registryAddress);
		const plcr = await PLCRVoting.at(PLCRVotingAddress);

		let listingHash = process.argv.slice(-2)[0];
		let data = process.argv.slice(-2)[1];
		console.log(listingHash, data);
		let challengeID = await registry.challenge(listingHash, data);
		console.log('ChallengeID: ', challengeID.logs[0].args);

		done();
	}

	deployProxies().then(() => done());
};
