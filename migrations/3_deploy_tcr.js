const AttributeStore = artifacts.require('tcr/AttributeStore');
const DLL = artifacts.require('tcr/PLCR/dependencies/DLL');
const PLCRFactory = artifacts.require('tcr/PLCRFactory');
const ParameterizerFactory = artifacts.require('tcr/ParameterizerFactory');
const RegistryFactory = artifacts.require('tcr/RegistryFactory');
const Registry = artifacts.require('tcr/Registry');
const GOV = artifacts.require('tokens/GOV');
const REP = artifacts.require('tokens/REP');

const Fin4Main = artifacts.require('Fin4Main');
const Fin4TokenManagement = artifacts.require('Fin4TokenManagement');
const Fin4Claiming = artifacts.require('Fin4Claiming');
const Fin4Verifying = artifacts.require('Fin4Verifying');
const Fin4Voting = artifacts.require('Fin4Voting');
const LimitedVoting = artifacts.require('LimitedVoting');
const Picture = artifacts.require('PictureVoting');
const Video = artifacts.require('VideoVoting');



const fs = require('fs');
//var path = require('path');
const config = JSON.parse(fs.readFileSync('./config.json'));
const paramConfig = config.paramConfig;
//const tokenHolders = config.token.tokenHolders;

const TCRactive = true; // the other necessary switch is in src/components/utils.js

module.exports = async function(deployer) {
	await deployer.deploy(REP);
	const REPTokenInstance = await REP.deployed();
	const Fin4VotingInstance = await Fin4Voting.deployed();
	await Fin4VotingInstance.setFin4ReputationAddress(REPTokenInstance.address);
	const LimitedVotingInstance = await LimitedVoting.deployed();
	await LimitedVotingInstance.setFin4ReputationAddress(REPTokenInstance.address);

	const PictureInstance = await Picture.deployed();
	await PictureInstance.setFin4ReputationAddress(REPTokenInstance.address);
	const VideoInstance = await Video.deployed();
	await VideoInstance.setFin4ReputationAddress(REPTokenInstance.address);

	// add Fin4TokenManagement and Fin4Claiming as minters on the Fin4Reputation token
	// as they will be the ones minting REP to users for certain types of activity
	const Fin4TokenManagementInstance = await Fin4TokenManagement.deployed();
	await Fin4TokenManagementInstance.setFin4ReputationAddress(REPTokenInstance.address);
	const Fin4ClaimingInstance = await Fin4Claiming.deployed();
	await Fin4ClaimingInstance.setFin4ReputationAddress(REPTokenInstance.address);
	await REPTokenInstance.addMinter(Fin4TokenManagementInstance.address);
	await REPTokenInstance.addMinter(Fin4ClaimingInstance.address);
	await REPTokenInstance.addMinter(LimitedVotingInstance.address);
	await REPTokenInstance.addMinter(PictureInstance.address);
	await REPTokenInstance.addMinter(VideoInstance.address);
	
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
		REPTokenInstance.address,
		config.token.isBurnable,
		config.token.isTransferable,
		config.token.isMintable,
		0
	);

	const GOVTokenInstance = await GOV.deployed();
	await REPTokenInstance.init(GOVTokenInstance.address);

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
		REPTokenInstance.address,
		GOVTokenInstance.address,
		RegistryInstance.address,
		PLCRVotingAddress,
		ParameterizerAddress
	);
};
