/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	// e.g. npm run revealVote -- <pollID(number)> <voteOption(0 or 1)> <salt(number)>
	async function revealVote() {
		let PLCRVotingAddress = config.PLCRVotingAddress;

		const plcr = await PLCRVoting.at(PLCRVotingAddress);

		let pollID = process.argv.slice(-3)[0];
		//has to be 1 or 0
		let voteOption = process.argv.slice(-3)[1];
		//has to be a number
		let salt = process.argv.slice(-3)[2];

		await plcr.revealVote(pollID, voteOption, salt);
		console.log('Vote revealed');

		return true;
	}

	revealVote().then(() => done());
};
