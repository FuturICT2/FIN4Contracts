const AttributeStore = artifacts.require('tcr/AttributeStore');
const DLL = artifacts.require('tcr/PLCR/dependencies/DLL');
const PLCRFactory = artifacts.require('tcr/PLCRFactory');
const ParameterizerFactory = artifacts.require('tcr/ParameterizerFactory');
const RegistryFactory = artifacts.require('tcr/RegistryFactory');
const Registry = artifacts.require('tcr/Registry');
const GOV = artifacts.require('tokens/GOV');
const Fin4Reputation = artifacts.require('Fin4Reputation');

const Fin4Main = artifacts.require('Fin4Main');

const fs = require('fs');
var path = require('path');
const config = JSON.parse(fs.readFileSync('./config.json'));
const paramConfig = config.paramConfig;
const tokenHolders = config.token.tokenHolders;

module.exports = async function(deployer) {
	// Deploy Dependencies
	await deployer.deploy(DLL);
	await deployer.deploy(AttributeStore);

	// Deploy PLCRFactory
	await deployer.link(DLL, PLCRFactory);
	await deployer.link(AttributeStore, PLCRFactory);
	await deployer.deploy(PLCRFactory);

	// Deploy ParametrizerFactory
	await deployer.link(DLL, ParameterizerFactory);
	await deployer.link(AttributeStore, ParameterizerFactory);
	const parametrizerFactoryInstance = await deployer.deploy(ParameterizerFactory, PLCRFactory.address);

	// Deploy RegistryFactory
	await deployer.link(DLL, RegistryFactory);
	await deployer.link(AttributeStore, RegistryFactory);
	const registryFactoryInstance = await deployer.deploy(RegistryFactory, ParameterizerFactory.address);

	await deployer.deploy(Fin4Reputation);
	const Fin4ReputationInstance = await Fin4Reputation.deployed();

	const GOVToken = await deployer.deploy(
		GOV,
		config.token.name,
		config.token.symbol,
		config.token.decimals,
		Fin4ReputationInstance.address,
		config.token.isBurnable,
		config.token.isTransferable,
		config.token.isMintable,
		0
	);

	const GOVTokenInstance = await GOV.deployed();
	await Fin4ReputationInstance.init(GOVTokenInstance.address);

	// dev: give all tokenHolders 10000 reputation tokens
	await Promise.all(tokenHolders.map(tokenHolder => Fin4ReputationInstance.mint(tokenHolder, 200000)));
	// get GOV token from rep tokens, happens via GUI now
	// await Promise.all(tokenHolders.map(tokenHolder => Fin4ReputationInstance.getGOVFromReputation(tokenHolder)));

	const registryReceipt = await registryFactoryInstance.newRegistryBYOToken(
		GOVTokenInstance.address,
		[
			paramConfig.minDeposit,
			paramConfig.pMinDeposit,
			paramConfig.applyStageLen,
			paramConfig.pApplyStageLen,
			paramConfig.commitStageLen,
			paramConfig.pCommitStageLen,
			paramConfig.revealStageLen,
			paramConfig.pRevealStageLen,
			paramConfig.dispensationPct,
			paramConfig.pDispensationPct,
			paramConfig.voteQuorum,
			paramConfig.pVoteQuorum,
			paramConfig.exitTimeDelay,
			paramConfig.exitPeriodLen,
			paramConfig.reviewTax,
			paramConfig.pminReputation
		],
		config.name
	);

	const { token, plcr, parameterizer, registry } = registryReceipt.logs[0].args;
	console.log(registryReceipt.logs);

	// await GOVTokenInstance.approve(registry, 1000); // happens via GUI now
	await GOVTokenInstance.init(registry, parameterizer, plcr);

	const RegistryInstance = await Registry.at(registry);
	const Fin4MainInstance = await Fin4Main.deployed();

	const PLCRVotingAddress = await RegistryInstance.voting();

	await Fin4MainInstance.setTCRaddresses(
		Fin4ReputationInstance.address,
		GOVTokenInstance.address,
		RegistryInstance.address,
		PLCRVotingAddress
	);

	// write Fin4Main and registry address to src/config/DeployedAddresses.js
	let data =
		"const RepTokenAddress = '" +
		Fin4ReputationInstance.address +
		"';\n" +
		"const GOVTokenAddress = '" +
		GOVTokenInstance.address +
		"';\n" +
		"const Fin4MainAddress = '" +
		Fin4MainInstance.address +
		"';\n" +
		"const RegistryAddress = '" +
		RegistryInstance.address +
		"';\n" +
		"const PLCRVotingAddress = '" +
		PLCRVotingAddress +
		"';\n" +
		'export { Fin4MainAddress, RegistryAddress, PLCRVotingAddress, GOVTokenAddress, RepTokenAddress };\n';
	fs.writeFile(path.join(__dirname, '../src/config/DeployedAddresses.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});

	let jsonData =
		'{\n' +
		'"GOVTokenAddress": "' +
		GOVTokenInstance.address +
		'",\n' +
		'"Fin4MainAddress": "' +
		Fin4MainInstance.address +
		'",\n' +
		'"RegistryAddress": "' +
		RegistryInstance.address +
		'",\n' +
		'"PLCRVotingAddress": "' +
		PLCRVotingAddress +
		'"\n' +
		'}\n';
	fs.writeFile(path.join(__dirname, '../scripts/DeployedAddresses.json'), jsonData, err => {
		if (err) throw 'Error writing file: ' + err;
	});

	// Token-TCR-Dev-1, Token-TCR-Dev-2, Token-TCR-Dev-3, Token-TCR-Dev-4, Token-TCR-Dev-5
	//const children = await Fin4MainInstance.getChildren();
	//await RegistryInstance.applyToken(children[0], 150, 'data');
	//await RegistryInstance.applyToken(children[1], 150, 'data');
	//await RegistryInstance.applyToken(children[2], 150, 'data');
	//console.log("Token address: ", children[0])
	//console.log('hallo', await RegistryInstance.listings);
};
