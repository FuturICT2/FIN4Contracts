/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');
const { soliditySha3 } = require('web3-utils');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('ERC20Plus.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function revealVote() {
		let registryAddress = config.RegistryAddress;
		let fin4MainAddress = config.Fin4MainAddress;
		let PLCRVotingAddress = config.PLCRVotingAddress;

		const registry = await Registry.at(registryAddress);
		const plcr = await PLCRVoting.at(PLCRVotingAddress);

		console.log('myAddress: ', myAddress);
		let pollID = process.argv.slice(-4)[0];
		//has to be 1 or 0
		let voteOption = process.argv.slice(-4)[1];
		let salt = process.argv.slice(-4)[2];

		await plcr.revealVote(pollID, voteOption, salt);
		console.log('Vote revealed');

		return true;
	}

	revealVote().then(() => done());
};
