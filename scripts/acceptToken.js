/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('ERC20Plus.sol');

const config = JSON.parse(fs.readFileSync('../src/config/DeployedAddresses.js'));

module.exports = done => {
	async function deployProxies(networkID) {
		let registryFactoryAddress;
		let registryAddress = config.RegistryAddress;
		let fin4MainAddress = config.Fin4MainAddress;

		/* eslint-disable no-console */
		console.log('Using RegistryFactory at:');
		console.log(`     ${registryAddress}`);
		console.log('Using Fin4Main at:');
		console.log(`     ${fin4MainAddress}`);
		console.log('');
		console.log('Deploying proxy contracts...');
		console.log('...');
		/* eslint-enable no-console */

		const registry = await Registry.at(registryAddress);

		const { token, plcr, parameterizer, registry } = registryReceipt.logs[0].args;

		const registryProxy = await Registry.at(registry);
		const tokenProxy = await Token.at(token);
		const registryName = await registryProxy.name.call();

		/* eslint-disable no-console */
		console.log(`Proxy contracts successfully migrated to network_id: ${networkID}`);
		console.log('');
		console.log(`${config.token.name} (EIP20):`);
		console.log(`     ${token}`);
		console.log('PLCRVoting:');
		console.log(`     ${plcr}`);
		console.log('Parameterizer:');
		console.log(`     ${parameterizer}`);
		console.log(`${registryName} (Registry):`);
		console.log(`     ${registry}`);
		console.log('');

		const evenTokenDispensation = new BN(config.token.supply).div(config.token.tokenHolders.length).toString();
		console.log(`Dispensing ${config.token.supply} tokens evenly to ${config.token.tokenHolders.length} addresses:`);
		console.log('');

		await Promise.all(
			config.token.tokenHolders.map(async account => {
				console.log(`Transferring tokens to address: ${account}`);
				return tokenProxy.transfer(account, evenTokenDispensation);
			})
		);
		/* eslint-enable no-console */

		return true;
	}

	// web3 requires callback syntax. silly!
	web3.version.getNetwork((err, network) => {
		if (err) {
			return done(err); // truffle exec exits if an error gets returned
		}
		return deployProxies(network).then(() => done());
	});
};
