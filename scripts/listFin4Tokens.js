/* global artifacts web3 */
const fs = require('fs');
const BN = require('bignumber.js');

const Fin4Main = artifacts.require('Fin4Main');

const config = JSON.parse(fs.readFileSync('./DeployedAddresses.json'));

module.exports = done => {
	// e.g. npm run listFin4Tokens
	async function deployProxies() {
		let fin4MainAddress = config.Fin4MainAddress;

		const Fin4MainInstance = await Fin4Main.at(fin4MainAddress);
		const children = await Fin4MainInstance.getChildren();
		console.log(children);
		return true;
	}

	deployProxies().then(() => done());
};
