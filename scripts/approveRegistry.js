/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Token = artifacts.require('GOV.sol');
const Registry = artifacts.require('Registry.sol');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	async function approveRegistry() {
		let registryAddress = config.RegistryAddress;
		let GOVTokenAddress = config.GOVTokenAddress;

		registry = await Registry.at(registryAddress);
		GOVTokenInstance = await Token.at(GOVTokenAddress);

		//console.log(GOVTokenInstance);
		amount = process.argv.slice(-1)[0];
		console.log('Registry Address: ', registryAddress);
		console.log('requested amount: ', amount);

		myAddress = await registry.whoAmI();
		console.log('My address: ', myAddress);

		availableAmount = await GOVTokenInstance.balanceOf(myAddress);
		console.log('available amount: ', new BN(availableAmount).toString());

		oldAllowance = await GOVTokenInstance.allowance(myAddress, registryAddress);
		console.log('Old allowance: ', new BN(oldAllowance).toString());

		await GOVTokenInstance.approve(registryAddress, amount);

		newAllowance = await GOVTokenInstance.allowance(myAddress, registryAddress);
		console.log('New allowance: ', new BN(newAllowance).toString());
		return true;
	}

	approveRegistry().then(() => done());
};

//function web3ResultToNumber(res) {
//	return parseInt(res.match("<BN: (.*)>")[1], 16);
//}
