/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	// e.g. npm run getPoll -- <pollID(number)>
	async function getPoll() {
		let PLCRVotingAddress = config.PLCRVotingAddress;

		const plcr = await PLCRVoting.at(PLCRVotingAddress);

		let pollID = process.argv.slice(-1)[0];

		//Get information about the poll

		await plcr.pollMap
			.call(pollID)
			.then(({ 0: commitEndDate, 1: revealEndDate, 2: voteQuorum, 3: votesFor, 4: votesAgainst }) => {
				let pollObj = {};
				pollObj = {
					commitEndDate: new Date(parseInt(new BN(commitEndDate).toString()) * 1000).toISOString(),
					revealEndDate: new Date(parseInt(new BN(revealEndDate).toString()) * 1000).toISOString(),
					voteQuorum: new BN(voteQuorum).toString(),
					votesFor: new BN(votesFor).toString(),
					votesAgainst: new BN(votesAgainst).toString()
				};
				console.log(pollObj);
			});
		return true;
	}

	getPoll().then(() => done());
};
