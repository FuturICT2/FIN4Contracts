const fs = require('fs');
const path = require('path');
const config = require('../config.json');

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
const SwapSourcerer = artifacts.require('SwapSourcerer');
const MintingSourcerer = artifacts.require('MintingSourcerer');
const BurnSourcerer = artifacts.require('BurnSourcerer');
// dev
// const TestImplOfSuccClaimNotifer = artifacts.require('TestImplOfSuccClaimNotifer');
// const ERC20Mintable = artifacts.require('ERC20Mintable');

//const Fin4OracleHub = artifacts.require('Fin4OracleHub');

const verifierContractNames = [
	'ApprovalByGroupMember',
	'SelfieTogether',
	'BlockThese',
	'AllowOnlyThese',
	// 'SensorOneTimeSignal',
	/* 
	These include the submissions feature:
	'Idea',
	'Networking',
	'HappyMoment',
	*/
	'SelfApprove',
	'SpecificAddress',
	'TokenCreatorApproval',
	'Password',
	'Picture',
	'Location',
	'ClaimableOnlyNTimesPerUser',
	'Blocker',
	'Statement', // has submissions
	'Vote' // has submissions
	// 'MinimumInterval',
	// 'MaximumQuantityPerInterval'
];

const verifierContracts = verifierContractNames.map(contractName => {
	return 	artifacts.require(contractName);
});

const UnderlyingsActive = false; // the other necessary switch is in src/components/utils.js

module.exports = async function(deployer) {
	// FIN4MAIN

	await deployer.deploy(Fin4Main);
	const Fin4MainInstance = await Fin4Main.deployed();

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

	//await deployer.deploy(Fin4OracleHub);
	//const Fin4OracleHubInstance = await Fin4OracleHub.deployed();

	await Fin4MainInstance.setSatelliteAddresses(
		Fin4UncappedTokenCreatorInstance.address,
		Fin4CappedTokenCreatorInstance.address,
		Fin4TokenManagementInstance.address,
		Fin4ClaimingInstance.address,
		Fin4CollectionsInstance.address,
		Fin4MessagingInstance.address,
		Fin4VerifyingInstance.address,
		Fin4GroupsInstance.address,
		Fin4SystemParametersInstance.address,
		Fin4UnderlyingsInstanceAddress
	);

	// VERIFIER TYPES

	await Promise.all(verifierContracts.map((contract, index) => deployer.deploy(contract)));
	const verifierInstances = await Promise.all(verifierContracts.map(contract => contract.deployed()));
	await Promise.all(verifierInstances.map((instance, index) => instance.setContractName(verifierContractNames[index])));
	await Promise.all(verifierInstances.map(({ address }) => Fin4VerifyingInstance.addVerifierType(address)));

	// FIN4 UNDERLYINGS IMPLEMENTATIONS - note that the name passed in must match the contract name exactly for those with contract addresses
	
	if (UnderlyingsActive) {
		await deployer.deploy(SwapSourcerer);
		const SwapSourcererInstance = await SwapSourcerer.deployed();
		await Fin4UnderlyingsInstance.addSourcerer(web3.utils.fromAscii("SwapSourcerer"), SwapSourcererInstance.address);

		await deployer.deploy(MintingSourcerer);
		const MintingSourcererInstance = await MintingSourcerer.deployed();
		await Fin4UnderlyingsInstance.addSourcerer(web3.utils.fromAscii("MintingSourcerer"), MintingSourcererInstance.address);

		await deployer.deploy(BurnSourcerer);
		const BurnSourcererInstance = await BurnSourcerer.deployed();
		await Fin4UnderlyingsInstance.addSourcerer(web3.utils.fromAscii("BurnSourcerer"), BurnSourcererInstance.address);
	}

	// Add contract addresses that verifier need
	// TODO think about something better then identifiying them by indices

	// ApprovalByGroupMember
	await verifierInstances[0].setFin4GroupsAddress(Fin4GroupsInstance.address);
	await verifierInstances[0].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// SelfieTogether
	await verifierInstances[1].setFin4GroupsAddress(Fin4GroupsInstance.address);
	await verifierInstances[1].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// BlockThese
	await verifierInstances[2].setFin4GroupsAddress(Fin4GroupsInstance.address);
	// AllowOnlyThese
	await verifierInstances[3].setFin4GroupsAddress(Fin4GroupsInstance.address);
	// SpecificAddress
	await verifierInstances[5].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// TokenCreatorApproval
	await verifierInstances[6].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// Picture
	await verifierInstances[8].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// Statement
	await verifierInstances[12].setFin4VerifyingAddress(Fin4VerifyingInstance.address);
	// Vote
	await verifierInstances[13].setFin4VerifyingAddress(Fin4VerifyingInstance.address);

	//... setFin4OracleHubAddress(Fin4OracleHubInstance.address);
	//... setFin4VerifyingAddress(Fin4VerifyingInstance.address);

	await Fin4CollectionsInstance.setFin4GroupsAddress(Fin4GroupsInstance.address);

	// Write Fin4Main address to src/config/deployment-info.js
	let data = "const Fin4MainAddress = '" + Fin4MainInstance.address + "';\n" +
		"const networkName = '" + deployer.network + "';\n" +
		"export { Fin4MainAddress, networkName };\n";
	fs.writeFile(path.join(__dirname, config.DEPLOYMENT_INFO_SAVING_LOCATION + '/deployment-info.js'), data, err => {
		if (err) throw 'Error writing file: ' + err;
	});

	// Write Fin4OracleHub address to src/config/Fin4OracleHubAddress.js
	//data =
	//	"const Fin4OracleHubAddress = '" + Fin4OracleHubInstance.address + "';\n" + 'export { Fin4OracleHubAddress };\n';
	//fs.writeFile(path.join(__dirname, config.DEPLOYMENT_INFO_SAVING_LOCATION + '/Fin4OracleHubAddress.js'), data, err => {
	//	if (err) throw 'Error writing file: ' + err;
	//});

	//console.log('-----------> Address of Fin4OracleHub: ', Fin4OracleHubInstance.address);

	// await Fin4MainInstance.createNewToken('Token-Dev-1', 'TD1', [], [], []);

	// dev
	// await deployer.deploy(TestImplOfSuccClaimNotifer);
	// await deployer.deploy(ERC20Mintable);
};
