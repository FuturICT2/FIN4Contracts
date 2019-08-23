/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('ERC20Plus.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function deployProxies() {
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

		let listings = await registry.getListings();
		console.log(listings);
		await registry.updateStatus('0x00000000000000000000000009f90c3b2c2a9129581733a8de5c096f54dc049a');
		listings = await registry.getListings();
		console.log(listings);
		console.log('bla');
		done();
	}

	deployProxies().then(() => done());
};
