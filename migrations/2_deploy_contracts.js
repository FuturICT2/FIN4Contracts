const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const { verifiers, verifierOptions } = require("../verifiers");

const Fin4Main = artifacts.require('Fin4Main');
const Fin4UncappedTokenCreator = artifacts.require('Fin4UncappedTokenCreator');
const Fin4CappedTokenCreator = artifacts.require('Fin4CappedTokenCreator');
const Fin4TokenManagement = artifacts.require('Fin4TokenManagement');
const Fin4Claiming = artifacts.require('Fin4Claiming');
const Fin4Collections = artifacts.require('Fin4Collections');
const Fin4Messaging = artifacts.require('Fin4Messaging');
const Fin4Verifying = artifacts.require('Fin4Verifying');
const Fin4Groups = artifacts.require('Fin4Groups');
const Fin4SystemParameters = artifacts.require('Fin4SystemParameters');
const Fin4Underlyings = artifacts.require('Fin4Underlyings');
const Fin4Voting = artifacts.require('Fin4Voting');
// const Fin4OracleHub = artifacts.require('Fin4OracleHub');

const SwapSourcerer = artifacts.require('SwapSourcerer');
const MintingSourcerer = artifacts.require('MintingSourcerer');
const BurnSourcerer = artifacts.require('BurnSourcerer');
// dev
// const TestImplOfSuccClaimNotifer = artifacts.require('TestImplOfSuccClaimNotifer');
// const ERC20Mintable = artifacts.require('ERC20Mintable');

const Trigonometry = artifacts.require('Trigonometry');
const Strings = artifacts.require('strings');

Object.keys(verifiers).map(contractName => {
	verifiers[contractName].contractArtifact = artifacts.require(contractName)
});

const UnderlyingsActive = true; // the other necessary switch is in src/components/utils.js

module.exports = async function(deployer) {

	// FIN4MAIN

	await deployer.deploy(Fin4Main);
	const Fin4MainInstance = await Fin4Main.deployed();

	// LIBRARIES

	await deployer.deploy(Trigonometry);
	await Trigonometry.deployed();
	deployer.link(Trigonometry, verifiers.Location.contractArtifact);

	await deployer.deploy(Strings);
	await Strings.deployed();
	deployer.link(Strings, verifiers.Location.contractArtifact);

	// SATELLITE CONTRACTS

	await deployer.deploy(Fin4SystemParameters);
	const Fin4SystemParametersInstance = await Fin4SystemParameters.deployed();

	let Fin4UnderlyingsInstanceAddress = '0x0000000000000000000000000000000000000000';
	let Fin4UnderlyingsInstance;
	if (UnderlyingsActive) {
		await deployer.deploy(Fin4Underlyings);
		Fin4UnderlyingsInstance = await Fin4Underlyings.deployed();
		Fin4UnderlyingsInstanceAddress = Fin4UnderlyingsInstance.address;
	}

	await deployer.deploy(Fin4Verifying);
	const Fin4VerifyingInstance = await Fin4Verifying.deployed();
	await deployer.deploy(Fin4Claiming, Fin4SystemParametersInstance.address, Fin4UnderlyingsInstanceAddress);
	const Fin4ClaimingInstance = await Fin4Claiming.deployed();

	await deployer.deploy(Fin4TokenManagement, Fin4SystemParametersInstance.address);
	const Fin4TokenManagementInstance = await Fin4TokenManagement.deployed();

	await deployer.deploy(Fin4UncappedTokenCreator, Fin4ClaimingInstance.address, Fin4TokenManagementInstance.address, Fin4UnderlyingsInstanceAddress);
	await deployer.deploy(Fin4CappedTokenCreator, Fin4ClaimingInstance.address, Fin4TokenManagementInstance.address, Fin4UnderlyingsInstanceAddress);
	const Fin4UncappedTokenCreatorInstance = await Fin4UncappedTokenCreator.deployed();
	const Fin4CappedTokenCreatorInstance = await Fin4CappedTokenCreator.deployed();

	await deployer.deploy(Fin4Collections);
	const Fin4CollectionsInstance = await Fin4Collections.deployed();
	await deployer.deploy(Fin4Messaging);
	const Fin4MessagingInstance = await Fin4Messaging.deployed();
	await deployer.deploy(Fin4Groups, Fin4MessagingInstance.address);
	const Fin4GroupsInstance = await Fin4Groups.deployed();

	await deployer.deploy(Fin4Voting, Fin4SystemParametersInstance.address);
	const Fin4VotingInstance = await Fin4Voting.deployed();
	Fin4VerifyingInstance.setFin4VotingAddress(Fin4VotingInstance.address);
	// await deployer.deploy(Fin4OracleHub);
	// const Fin4OracleHubInstance = await Fin4OracleHub.deployed();

	let instanceMap = {
		Fin4Verifying: Fin4VerifyingInstance.address,
		Fin4Messaging: Fin4MessagingInstance.address,
		Fin4OracleHub: null,
		Fin4Groups: Fin4GroupsInstance.address,
		Fin4SystemParameters: Fin4SystemParametersInstance.address,
		Fin4Reputation: null, // happens in 3_deploy_tcr.js, manually (for now?)
		Fin4Voting: Fin4VotingInstance.address
	}

	await Fin4MainInstance.setSatelliteAddresses(
		Fin4UncappedTokenCreatorInstance.address,
		Fin4CappedTokenCreatorInstance.address,
		Fin4TokenManagementInstance.address,
		Fin4ClaimingInstance.address,
		Fin4CollectionsInstance.address,
		instanceMap.Fin4Messaging,
		instanceMap.Fin4Verifying,
		instanceMap.Fin4Groups,
		instanceMap.Fin4SystemParameters,
		Fin4UnderlyingsInstanceAddress,
		instanceMap.Fin4Voting,
	);

	// VERIFIER TYPES

	for (let [contractName, verifierDef] of Object.entries(verifiers)) {
		let contract = verifierDef.contractArtifact;
		await deployer.deploy(contract);
		let instance = await contract.deployed();
		await instance.setContractName(contractName);
		for (let i = 0; i < verifierDef.requiredAddresses.length; i ++) {
			// that's the name of the Fin4 satellite contract that the verifier needs to know the address of
			let requiredAddress = verifierDef.requiredAddresses[i];
			if (instanceMap[requiredAddress]) { // is null for Fin4Reputation
				await instance['set' + requiredAddress + 'Address'](instanceMap[requiredAddress]);
			}
		}
		await Fin4VerifyingInstance.addVerifierType(instance.address);
		verifiers[contractName].address = instance.address;

		// clean up before it gets written out to verifier-info.js
		delete verifiers[contractName].contractArtifact;
		delete verifiers[contractName].requiredAddresses;
	};

	// FIN4 UNDERLYINGS IMPLEMENTATIONS - note that the name passed in must match the contract name exactly for those with contract addresses
	
	if (UnderlyingsActive) {
		await deployer.deploy(SwapSourcerer, Fin4UnderlyingsInstanceAddress);
		const SwapSourcererInstance = await SwapSourcerer.deployed();
		await Fin4UnderlyingsInstance.addSourcerer(web3.utils.fromAscii("SwapSourcerer"), SwapSourcererInstance.address);

		await deployer.deploy(MintingSourcerer, Fin4UnderlyingsInstanceAddress);
		const MintingSourcererInstance = await MintingSourcerer.deployed();
		await Fin4UnderlyingsInstance.addSourcerer(web3.utils.fromAscii("MintingSourcerer"), MintingSourcererInstance.address);

		await deployer.deploy(BurnSourcerer, Fin4UnderlyingsInstanceAddress);
		const BurnSourcererInstance = await BurnSourcerer.deployed();
		await Fin4UnderlyingsInstance.addSourcerer(web3.utils.fromAscii("BurnSourcerer"), BurnSourcererInstance.address);
	}

	//... setFin4OracleHubAddress(Fin4OracleHubInstance.address);
	//... setFin4VerifyingAddress(Fin4VerifyingInstance.address);

	await Fin4CollectionsInstance.setFin4GroupsAddress(Fin4GroupsInstance.address);

	let networkName = deployer.network;
	if (networkName.split('-fork').length > 1) {
		networkName = networkName.split('-fork')[0];
	}

	// Write Fin4Main address to src/config/deployment-info.js
	let data = "const Fin4MainAddress = '" + Fin4MainInstance.address + "';\n" +
		"const networkName = '" + networkName + "';\n" +
		"export { Fin4MainAddress, networkName };\n";
	fs.writeFile(path.join(__dirname, config.DEPLOYMENT_INFO_SAVING_LOCATION + '/deployment-info.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});

	let verifierData =
		`export const verifierOptions = ${JSON.stringify(verifierOptions, null, 2)};\n\n` +
		`export const verifiers = ${JSON.stringify(verifiers, null, 2)};\n`;
	fs.writeFile(path.join(__dirname, config.DEPLOYMENT_INFO_SAVING_LOCATION + '/verifier-info.js'), verifierData, (err) => {
		if (err) throw 'Error writing file: ' + err;
	});

	// Write Fin4OracleHub address to src/config/Fin4OracleHubAddress.js
	// data =
	// 	"const Fin4OracleHubAddress = '" + Fin4OracleHubInstance.address + "';\n" + 'export { Fin4OracleHubAddress };\n';
	// fs.writeFile(path.join(__dirname, config.DEPLOYMENT_INFO_SAVING_LOCATION + '/Fin4OracleHubAddress.js'), data, err => {
	// 	if (err) throw 'Error writing file: ' + err;
	// });

	//console.log('-----------> Address of Fin4OracleHub: ', Fin4OracleHubInstance.address);

	// await Fin4MainInstance.createNewToken('Token-Dev-1', 'TD1', [], [], []);

	// dev
	// await deployer.deploy(TestImplOfSuccClaimNotifer);
	// await deployer.deploy(ERC20Mintable);
};
