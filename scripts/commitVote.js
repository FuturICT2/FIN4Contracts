/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');
const { soliditySha3 } = require('web3-utils');

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

		console.log('PLCRVoting contract address: ', plcr.address);

		myAddress = await registry.whoAmI();
		console.log('myAddress: ', myAddress);

		let pollID = process.argv.slice(-4)[0];
		//has to be 1 or 0
		let voteOption = process.argv.slice(-4)[1];
		let salt = process.argv.slice(-4)[2];
		let numberOfTokens = process.argv.slice(-4)[3];

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

		let prevPollID = parseInt(
			new BN(await plcr.getInsertPointForNumTokens(myAddress, numberOfTokens, pollID)).toString()
		);

		secretHash = soliditySha3(voteOption, salt);
		console.log(
			'pollID: ',
			pollID,
			'secretHash: ',
			secretHash,
			'numberOfTokens: ',
			numberOfTokens,
			'prevPollID: ',
			prevPollID
		);
		await plcr.commitVote(pollID, secretHash, numberOfTokens, prevPollID);

		console.log('Vote commited');
		return true;
	}

	commitVote().then(() => done());
};
