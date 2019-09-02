/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('GOV.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function apply() {
		let registryAddress = config.RegistryAddress;

		const registry = await Registry.at(registryAddress);
		let listingHash = process.argv.slice(-1)[0];
		await registry.updateStatus(listingHash);

		return true;
	}

	apply().then(() => done());
};
