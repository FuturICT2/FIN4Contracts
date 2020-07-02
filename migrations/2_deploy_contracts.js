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
const Trigonometry = artifacts.require('Trigonometry');
const Strings = artifacts.require('strings');
const Fin4Voting = artifacts.require('Fin4Voting');
// const Location = artifacts.require('Location');
//const Fin4OracleHub = artifacts.require('Fin4OracleHub');
const verifierTypeContracts = [
	artifacts.require('ApprovalByGroupMember'),
	artifacts.require('SelfieTogether'),
	artifacts.require('Blacklisting'),
	artifacts.require('Whitelisting'),
	artifacts.require('SelfApprove'),
	artifacts.require('SpecificAddress'),
	artifacts.require('TokenCreatorApproval'),
	artifacts.require('Password'),
	artifacts.require('Picture'),
	artifacts.require('Location'),
	artifacts.require('ClaimableOnlyNTimesPerUser'),
	artifacts.require('LimitedVoting'),
	artifacts.require('PictureVoting'),
	artifacts.require('VideoVoting')
	//artifacts.require('SensorOneTimeSignal'),
];
module.exports = async function(deployer) {
	// FIN4MAIN

	await deployer.deploy(Fin4Main);
	const Fin4MainInstance = await Fin4Main.deployed();

	await deployer.deploy(Trigonometry);
	const TrigonometryInstance = await Trigonometry.deployed();
	deployer.link(Trigonometry, verifierTypeContracts[9]);

	await deployer.deploy(Strings);
	const StringsInstance = await Strings.deployed();
	deployer.link(Strings, verifierTypeContracts[9]);

	// await deployer.deploy(Location);
	// const LocationInstance = await Location.deployed();

	// SATELLITE CONTRACTS

	await deployer.deploy(Fin4SystemParameters);
	const Fin4SystemParametersInstance = await Fin4SystemParameters.deployed();

	await deployer.deploy(Fin4Verifying);
	const Fin4VerifyingInstance = await Fin4Verifying.deployed();
	await deployer.deploy(Fin4Claiming, Fin4SystemParametersInstance.address);
	const Fin4ClaimingInstance = await Fin4Claiming.deployed();

	await deployer.deploy(Fin4TokenManagement, Fin4SystemParametersInstance.address);
	const Fin4TokenManagementInstance = await Fin4TokenManagement.deployed();

	await deployer.deploy(Fin4UncappedTokenCreator, Fin4ClaimingInstance.address, Fin4TokenManagementInstance.address);
	await deployer.deploy(Fin4CappedTokenCreator, Fin4ClaimingInstance.address, Fin4TokenManagementInstance.address);
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
		Fin4VotingInstance.address
	);

	// VERIFIER TYPES

	await Promise.all(verifierTypeContracts.map(contract => deployer.deploy(contract)));
	const verifierTypeInstances = await Promise.all(verifierTypeContracts.map(contract => contract.deployed()));
	await Promise.all(verifierTypeInstances.map(({ address }) => Fin4VerifyingInstance.addVerifierType(address)));
	await Fin4VotingInstance.setFin4GroupsAddress(Fin4GroupsInstance.address);
	// Add contract addresses that verifier need
	// TODO think about something better then identifiying them by indices

	// ApprovalByGroupMember
	await verifierTypeInstances[0].setFin4GroupsAddress(Fin4GroupsInstance.address);
	await verifierTypeInstances[0].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// SelfieTogether
	await verifierTypeInstances[1].setFin4GroupsAddress(Fin4GroupsInstance.address);
	await verifierTypeInstances[1].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// Blacklisting
	await verifierTypeInstances[2].setFin4GroupsAddress(Fin4GroupsInstance.address);
	// Whitelisting
	await verifierTypeInstances[3].setFin4GroupsAddress(Fin4GroupsInstance.address);
	// SpecificAddress
	await verifierTypeInstances[5].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// TokenCreatorApproval
	await verifierTypeInstances[6].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// Picture
	await verifierTypeInstances[8].setFin4MessagingAddress(Fin4MessagingInstance.address);
	// LimitedVoting
	await verifierTypeInstances[11].setFin4GroupsAddress(Fin4GroupsInstance.address);
	await verifierTypeInstances[11].setFin4MessagingAddress(Fin4MessagingInstance.address);
	await verifierTypeInstances[11].setFin4tokenManagementAddress(Fin4TokenManagementInstance.address);
	await verifierTypeInstances[11].setFin4SystemParametersAddress(Fin4SystemParametersInstance.address);
	await verifierTypeInstances[11].setFin4VotingAddress(Fin4VotingInstance.address);
	// PictureVoting
	await verifierTypeInstances[12].setFin4GroupsAddress(Fin4GroupsInstance.address);
	await verifierTypeInstances[12].setFin4MessagingAddress(Fin4MessagingInstance.address);
	await verifierTypeInstances[12].setFin4tokenManagementAddress(Fin4TokenManagementInstance.address);
	await verifierTypeInstances[12].setFin4SystemParametersAddress(Fin4SystemParametersInstance.address);
	await verifierTypeInstances[12].setFin4VotingAddress(Fin4VotingInstance.address);
	// VideoVoting
	await verifierTypeInstances[13].setFin4GroupsAddress(Fin4GroupsInstance.address);
	await verifierTypeInstances[13].setFin4MessagingAddress(Fin4MessagingInstance.address);
	await verifierTypeInstances[13].setFin4tokenManagementAddress(Fin4TokenManagementInstance.address);
	await verifierTypeInstances[13].setFin4SystemParametersAddress(Fin4SystemParametersInstance.address);
	await verifierTypeInstances[13].setFin4VotingAddress(Fin4VotingInstance.address);

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
  
    // Write Verifier info with instance addresses to src/config/verifier-info.js
  for (let i = 0; i < verifierTypeContracts.length; i++) {
    let verifierObject = verifiers[verifierTypeContracts[i]._json.contractName];
    if (verifierObject !== undefined) {
      verifierObject.address = verifierTypeInstances[i].address;
    }
  }
  let verifierData =
    `export const verifierOptions = ${JSON.stringify(verifierOptions)};\n` +
    `export const verifiers = ${JSON.stringify(verifiers)};\n`;
  fs.writeFile(
    path.join(
      __dirname,
      config.DEPLOYMENT_INFO_SAVING_LOCATION + "/verifier-info.js"
    ),
    verifierData,
    (err) => {
      if (err) throw "Error writing file: " + err;
    }
  );

	// Write Fin4OracleHub address to src/config/Fin4OracleHubAddress.js
	//data =
	//	"const Fin4OracleHubAddress = '" + Fin4OracleHubInstance.address + "';\n" + 'export { Fin4OracleHubAddress };\n';
	//fs.writeFile(path.join(__dirname, config.DEPLOYMENT_INFO_SAVING_LOCATION + '/Fin4OracleHubAddress.js'), data, err => {
	//	if (err) throw 'Error writing file: ' + err;
	//});

	//console.log('-----------> Address of Fin4OracleHub: ', Fin4OracleHubInstance.address);

	// await Fin4MainInstance.createNewToken('Token-Dev-1', 'TD1', [], [], []);
};
