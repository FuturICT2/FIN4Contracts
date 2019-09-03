/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('GOV.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	// e.g. npm run listRegistryTokens
	async function listRegistryTokens() {
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

		/* eslint-enable no-console */

		const registry = await Registry.at(registryAddress);
		const plcr = await PLCRVoting.at(PLCRVotingAddress);

		await registry
			.getListings()
			.then(
				({
					0: listingsKeys,
					1: applicationExpiries,
					2: whitelistees,
					3: owners,
					4: unstakedDeposits,
					5: challengeIDs
				}) => {
					let listingsObj = {};
					for (var i = 0; i < listingsKeys.length; i++) {
						let address = '0x' + listingsKeys[i].substr(26, listingsKeys[i].length - 1);
						listingsObj[address] = {
							address: address,
							listingKey: listingsKeys[i],
							applicationExpiry: new Date(parseInt(new BN(applicationExpiries[i]).toString()) * 1000).toISOString(),
							whitelisted: whitelistees[i],
							owner: owners[i],
							unstakedDeposit: new BN(unstakedDeposits[i]).toString(),
							challengeID: new BN(challengeIDs[i]).toString()
						};
					}
					console.log(listingsObj);
				}
			);
		return true;
	}

	listRegistryTokens().then(() => done());
};
