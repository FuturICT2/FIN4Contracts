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
		let PLCRVotingAddress = config.PLCRVotingAddress;

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
