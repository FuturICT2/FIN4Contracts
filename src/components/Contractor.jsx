import { Fin4MainAddress, PLCRVotingAddress } from '../config/DeployedAddresses.js';
import { ADD_MULTIPLE_FIN4_TOKENS } from '../middleware/actionTypes';
const BN = require('bignumber.js');

const getContract = (contractAddress, contractName) => {
	const contract = require('truffle-contract');
	const json = require('../build/contracts/' + contractName + '.json');
	let Contractor = contract({
		abi: json.abi
	});
	Contractor.setProvider(window.web3.currentProvider);
	return Contractor.at(contractAddress);
};

const getContractData = (contract, contractJson, method, methodArgs = []) => {
	const currentAccount = window.web3.currentProvider.selectedAddress;

	return getContract(contract, contractJson).then(instance => {
		return instance[method].call(...methodArgs, {
			from: currentAccount
		});
	});
};

let loadedAllFin4TokensIntoTheStore = false;

const loadAllFin4TokensIntoStoreIfNotDoneYet = props => {
	if (loadedAllFin4TokensIntoTheStore) {
		return;
	}
	getContractData(Fin4MainAddress, 'Fin4Main', 'getChildren')
		.then(tokens => {
			return tokens.map(address => {
				return getContractData(address, 'Fin4Token', 'getInfo').then(({ 0: name, 1: symbol }) => {
					return {
						name: name,
						symbol: symbol,
						address: address
					};
				});
			});
		})
		.then(promises => Promise.all(promises))
		.then(tokenArr => {
			props.dispatch({
				type: ADD_MULTIPLE_FIN4_TOKENS,
				tokenArr: tokenArr
			});
			loadedAllFin4TokensIntoTheStore = true;
		});
};

// DEPRECATED
const getAllActionTypes = () => {
	return getContractData(Fin4MainAddress, 'Fin4Main', 'getChildren')
		.then(tokens => {
			return tokens.map(address => {
				return getContractData(address, 'Fin4Token', 'getInfo').then(({ 0: name, 1: symbol }) => {
					return {
						value: address,
						label: `[${symbol}] ${name}`
					};
				});
			});
		})
		.then(data => Promise.all(data));
};

const getPollStatus = pollID => {
	// pollID is also called challengeID in Registry.sol
	return getContractData(PLCRVotingAddress, 'PLCRVoting', 'pollMap', [pollID]).then(
		({ 0: commitEndDateBN, 1: revealEndDateBN, 2: voteQuorum, 3: votesFor, 4: votesAgainst }) => {
			let commitEndDate = new BN(commitEndDateBN).toNumber() * 1000;
			let revealEndDate = new BN(revealEndDateBN).toNumber() * 1000;
			let nowTimestamp = Date.now();

			if (commitEndDate - nowTimestamp > 0) {
				return {
					inPeriod: PollStatus.IN_COMMIT_PERIOD,
					dueDate: new Date(commitEndDate).toLocaleString('de-CH-1996') // choose locale automatically?
				};
			}

			if (revealEndDate - nowTimestamp > 0) {
				return {
					inPeriod: PollStatus.IN_REVEAL_PERIOD,
					dueDate: new Date(revealEndDate).toLocaleString('de-CH-1996')
				};
			}

			return {
				inPeriod: PollStatus.PAST_REVEAL_PERIOD,
				dueDate: ''
			};
		}
	);
};

const PollStatus = {
	IN_COMMIT_PERIOD: 'Commit Vote',
	IN_REVEAL_PERIOD: 'Reveal',
	PAST_REVEAL_PERIOD: '-'
};

export {
	getContractData,
	getContract,
	getAllActionTypes,
	getPollStatus,
	PollStatus,
	loadAllFin4TokensIntoStoreIfNotDoneYet
};
