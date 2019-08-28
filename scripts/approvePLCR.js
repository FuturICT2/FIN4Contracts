/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Token = artifacts.require('GOV.sol');
const Registry = artifacts.require('Registry.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function approvePLCR() {
		let registryAddress = config.RegistryAddress;
		let PLCRVotingAddress = config.PLCRVotingAddress;
		let GOVTokenAddress = config.GOVTokenAddress;

		registry = await Registry.at(registryAddress);
		plcr = await PLCRVoting.at(PLCRVotingAddress);
		GOVTokenInstance = await Token.at(GOVTokenAddress);

		amount = process.argv.slice(-1)[0];
		console.log('PLCR Address: ', PLCRVotingAddress);
		console.log('Requested amount: ', amount);

		myAddress = await registry.whoAmI();
		console.log('My address: ', myAddress);

		availableAmount = await GOVTokenInstance.balanceOf(myAddress);
		console.log('Available amount: ', new BN(availableAmount).toString());

		oldAllowance = await GOVTokenInstance.allowance(myAddress, PLCRVotingAddress);
		console.log('Old allowance: ', new BN(oldAllowance).toString());

		await GOVTokenInstance.approve(PLCRVotingAddress, amount);

		newAllowance = await GOVTokenInstance.allowance(myAddress, PLCRVotingAddress);
		console.log('New allowance: ', new BN(newAllowance).toString());

		await plcr.requestVotingRights(amount);
		console.log('plcr.requestVotingRights: ', amount);

		return true;
	}

	approvePLCR().then(() => done());
};

//function web3ResultToNumber(res) {
//	return parseInt(res.match("<BN: (.*)>")[1], 16);
//}
