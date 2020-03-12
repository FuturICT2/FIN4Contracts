const AttributeStore = artifacts.require('tcr/AttributeStore');
const DLL = artifacts.require('tcr/PLCR/dependencies/DLL');
const PLCRFactory = artifacts.require('tcr/PLCRFactory');
const ParameterizerFactory = artifacts.require('tcr/ParameterizerFactory');
const RegistryFactory = artifacts.require('tcr/RegistryFactory');
const Registry = artifacts.require('tcr/Registry');
const GOV = artifacts.require('tokens/GOV');
const Fin4Reputation = artifacts.require('Fin4Reputation');

const Fin4Main = artifacts.require('Fin4Main');
const Fin4TokenManagement = artifacts.require('Fin4TokenManagement');
const Fin4Claiming = artifacts.require('Fin4Claiming');

const fs = require('fs');
//var path = require('path');
const config = JSON.parse(fs.readFileSync('./config.json'));
const paramConfig = config.paramConfig;
//const tokenHolders = config.token.tokenHolders;

const TCRactive = true; // the other necessary switch is in src/components/utils.js

module.exports = async function(deployer) {
	await deployer.deploy(Fin4Reputation);
	const Fin4ReputationInstance = await Fin4Reputation.deployed();

	// add Fin4TokenManagement and Fin4Claiming as minters on the Fin4Reputation token
	// as they will be the ones minting REP to users for certain types of activity
	const Fin4TokenManagementInstance = await Fin4TokenManagement.deployed();
	await Fin4TokenManagementInstance.setFin4ReputationAddress(Fin4ReputationInstance.address);
	const Fin4ClaimingInstance = await Fin4Claiming.deployed();
	await Fin4ClaimingInstance.setFin4ReputationAddress(Fin4ReputationInstance.address);
	await Fin4ReputationInstance.addMinter(Fin4TokenManagementInstance.address);
	await Fin4ReputationInstance.addMinter(Fin4ClaimingInstance.address);

	if (!TCRactive) {
		return;
	}

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
	// await Promise.all(tokenHolders.map(tokenHolder => Fin4ReputationInstance.mint(tokenHolder, 200000)));
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
			paramConfig.reviewVoteQuorum,
			paramConfig.challengeVoteQuorum,
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
	const ParameterizerAddress = await RegistryInstance.parameterizer();

	await Fin4MainInstance.setTCRaddresses(
		Fin4ReputationInstance.address,
		GOVTokenInstance.address,
		RegistryInstance.address,
		PLCRVotingAddress,
		ParameterizerAddress
	);
};
