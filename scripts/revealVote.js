/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function revealVote() {
		let PLCRVotingAddress = config.PLCRVotingAddress;

		const plcr = await PLCRVoting.at(PLCRVotingAddress);

		let pollID = process.argv.slice(-3)[0];
		//has to be 1 or 0
		let voteOption = process.argv.slice(-3)[1];
		let salt = process.argv.slice(-3)[2];

		await plcr.revealVote(pollID, voteOption, salt);
		console.log('Vote revealed');
		2;
		return true;
	}

	revealVote().then(() => done());
};
