/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('ERC20Plus.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function commitVote() {
		let registryAddress = config.RegistryAddress;
		let fin4MainAddress = config.Fin4MainAddress;
		let PLCRVotingAddress = config.PLCRVotingAddress;

		const registry = await Registry.at(registryAddress);
		const plcr = await PLCRVoting.at(PLCRVotingAddress);

		myAddress = await Registry.whoAmI();

		let pollID = process.argv.slice(-4)[0];
		//has to be 1 or 0
		let voteOption = process.argv.slice(-4)[1];
		let salt = process.argv.slice(-4)[2];

		let numTokens = process.argv.slice(-4)[3];

		let prevPollID = await plcr.getInsertPointForNumTokens(myAddress, numTokens, pollID);

		await plcr;

		let listings = await registry.getListings();
		console.log(listings);
		await registry.updateStatus('0x00000000000000000000000009f90c3b2c2a9129581733a8de5c096f54dc049a');
		listings = await registry.getListings();
		console.log(listings);
		console.log('bla');
		done();
	}

	commitVote().then(() => done());
};
