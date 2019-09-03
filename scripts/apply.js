/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('GOV.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	//e.g: npm run apply --  <token address(address)> <deposit(number)> <data(string)>
	async function apply() {
		let registryAddress = config.RegistryAddress;

		const registry = await Registry.at(registryAddress);
		let theToken = process.argv.slice(-3)[0];
		let deposit = process.argv.slice(-3)[1];
		let description = process.argv.slice(-3)[2];
		await registry.applyToken(theToken, deposit, description);

		return true;
	}

	apply().then(() => done());
};
