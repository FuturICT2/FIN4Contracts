import React, { Component } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { RegistryAddress, PLCRVotingAddress } from '../../config/DeployedAddresses.js';
import { getContractData, getAllActionTypes, getContract } from '../../components/Contractor';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { drizzleConnect } from 'drizzle-react';
import ContractForm from '../../components/ContractForm';
import { TextField } from '@material-ui/core';
const { soliditySha3 } = require('web3-utils');
const BN = require('bignumber.js');

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isApplyModalOpen: false,
			isVoteModalOpen: false,
			isRevealModalOpen: false,
			listings: {},
			allFin4Tokens: [],
			unlistedFin4Tokens: []
		};

		this.clickedToken = null;
		this.clickedPollID = null;
		this.resetVoteModalValues();

		getContractData(RegistryAddress, 'Registry', 'getListings').then(
			({
				0: listingsKeys,
				1: applicationExpiries,
				2: whitelistees,
				3: owners,
				4: unstakedDeposits,
				5: challengeIDs
			}) => {
				// Listings
				let listingsObj = {};
				for (var i = 0; i < listingsKeys.length; i++) {
					let address = '0x' + listingsKeys[i].substr(26, listingsKeys[i].length - 1);
					listingsObj[address] = {
						address: address,
						listingKey: listingsKeys[i],
						applicationExpiry: applicationExpiries[i],
						whitelisted: whitelistees[i],
						owner: owners[i],
						unstakedDeposit: unstakedDeposits[i],
						challengeID: new BN(challengeIDs[i]).toNumber(),
						name: '',
						status: '',
						statusIsCommit: true, // boolean to make button-label switching easier
						commitEndDate: '',
						revealEndDate: ''
					};
				}

				getContractData(RegistryAddress, 'Registry', 'getChallenges').then(
					({ 0: challengeIDs, 1: rewardPools, 2: challengers, 3: isReviews, 4: stakes, 5: totalTokenss }) => {
						let challengesObj = {};
						for (var i = 0; i < challengeIDs.length; i++) {
							let challengeID = new BN(challengeIDs[i]).toNumber();
							challengesObj[challengeID] = {
								challengeID: challengeID,
								rewardPool: new BN(rewardPools[i]).toString(),
								challenger: challengers[i],
								isReview: isReviews[i],
								stake: new BN(stakes[i]).toString(),
								totalTokens: new BN(totalTokenss[i]).toString()
							};
						}

						// TODO what is with those that are not in an application or challenge phase?
						let allPollPromises = Object.keys(listingsObj).map(tokenAddr => {
							let listing = listingsObj[tokenAddr];
							let challengeID = listing.challengeID;
							return getContractData(PLCRVotingAddress, 'PLCRVoting', 'pollMap', [challengeID]).then(
								({ 0: commitEndDateBN, 1: revealEndDateBN, 2: voteQuorum, 3: votesFor, 4: votesAgainst }) => {
									let commitEndDate = new BN(commitEndDateBN).toNumber() * 1000;
									let revealEndDate = new BN(revealEndDateBN).toNumber() * 1000;

									listing.commitEndDate = new Date(commitEndDate).toLocaleString('de-CH-1996');
									listing.revealEndDate = new Date(revealEndDate).toLocaleString('de-CH-1996');
									let nowTimestamp = Date.now();
									let inCommitPeriod = commitEndDate - nowTimestamp > 0;
									//let inRevealPeriod = !inCommitPeriod && revealEndDate - nowTimestamp > 0;

									let commit_reveal = inCommitPeriod ? 'commit period' : 'reveal period';
									let review_challenge = challengesObj[challengeID].isReview ? 'Review' : 'Challenge';
									listing.status = review_challenge + ': ' + commit_reveal;
									listing.statusIsCommit = inCommitPeriod;
								}
							);
						}); // Promise.all(allPollPromises).then(results => {});
					}
				);

				// Unlisted Fin4 Tokens
				getAllActionTypes().then(data => {
					this.setState({ allFin4Tokens: data });
					let unlistedFin4TokensArr = [];
					for (var i = 0; i < data.length; i++) {
						// addresses are case in-sensitive. the address-to-byte32 method in Registry.applyToken() leaves only lower-case
						let tokenAddr = data[i].value.toLowerCase();
						if (!listingsObj[tokenAddr]) {
							unlistedFin4TokensArr.push(data[i]);
						} else {
							listingsObj[tokenAddr].name = data[i].label;
						}
					}
					this.setState({ listings: listingsObj });
					this.setState({ unlistedFin4Tokens: unlistedFin4TokensArr });
				});
			}
		);
	}

	resetVoteModalValues() {
		this.voteModalValues = {
			vote: null,
			salt: null,
			numbTokens: null
		};
	}

	toggleApplyModal = () => {
		this.setState({ isApplyModalOpen: !this.state.isApplyModalOpen });
	};

	toggleVoteModal = () => {
		if (this.state.isVoteModalOpen) {
			this.resetVoteModalValues();
		}
		this.setState({ isVoteModalOpen: !this.state.isVoteModalOpen });
	};

	toggleRevealModal = () => {
		this.setState({ isRevealModalOpen: !this.state.isRevealModalOpen });
	};

	submitVoteModal = () => {
		if (
			this.voteModalValues.vote === null ||
			this.voteModalValues.salt === null ||
			this.voteModalValues.numbTokens === null
		) {
			alert('All values must be set.');
			return;
		}

		let currentAccount = window.web3.currentProvider.selectedAddress;
		let vote = this.voteModalValues.vote;
		let salt = this.voteModalValues.salt;
		let numbTokens = this.voteModalValues.numbTokens;
		let pollID = this.clickedPollID;
		this.toggleVoteModal();

		getContractData(PLCRVotingAddress, 'PLCRVoting', 'getInsertPointForNumTokens', [
			currentAccount,
			numbTokens,
			pollID
		]).then(prevPollIdBN => {
			let prevPollID = new BN(prevPollIdBN).toNumber();
			let secretHash = soliditySha3(vote, salt);

			let self = this;
			//console.log(pollID, secretHash, numbTokens, prevPollID);

			getContract(PLCRVotingAddress, 'PLCRVoting')
				.then(function(instance) {
					return instance.commitVote(pollID, secretHash, numbTokens, prevPollID, {
						from: currentAccount
					});
				})
				.then(function(result) {
					console.log('Results of submitting: ', result);
				})
				.catch(function(err) {
					console.log('Error: ', err.message);
				});
		});
	};

	render() {
		return (
			<center>
				<Box title="Listings">
					<Table headers={['Name', 'Status', 'Due Date', 'Actions']}>
						{Object.keys(this.state.listings).map((key, index) => {
							return (
								<TableRow
									key={index}
									data={{
										name: this.state.listings[key].name,
										status: this.state.listings[key].status,
										dueDate: this.state.listings[key].commitEndDate,
										actions: (
											<Button
												onClick={() => {
													this.clickedPollID = this.state.listings[key].challengeID;
													this.state.listings[key].statusIsCommit ? this.toggleVoteModal() : this.toggleRevealModal();
												}}>
												{this.state.listings[key].statusIsCommit ? 'Vote' : 'Reveal vote'}
											</Button>
										)
									}}
								/>
							);
						})}
					</Table>
				</Box>
				<Modal
					isOpen={this.state.isApplyModalOpen}
					handleClose={this.toggleApplyModal}
					title="Set deposit and data"
					width="400px">
					<ContractForm
						contractAddress={RegistryAddress}
						contractName="Registry"
						method="applyToken"
						staticArgs={{
							tokenAddress: this.clickedToken
						}}
						labels={['Token', 'Deposit', 'Data']}
						postSubmitCallback={this.toggleApplyModal}
					/>
				</Modal>
				<Modal
					isOpen={this.state.isVoteModalOpen}
					handleClose={this.toggleVoteModal}
					title="Set vote, salt and number of tokens"
					width="400px">
					<TextField
						key="set-vote"
						type="number"
						label="Vote (1 or 0)"
						onChange={e => (this.voteModalValues.vote = e.target.value)}
						style={inputFieldStyle}
					/>
					<TextField
						key="set-salt"
						type="number"
						label="Salt"
						onChange={e => (this.voteModalValues.salt = e.target.value)}
						style={inputFieldStyle}
					/>
					<TextField
						key="set-numb-tokens"
						type="number"
						label="Number of tokens"
						onChange={e => (this.voteModalValues.numbTokens = e.target.value)}
						style={inputFieldStyle}
					/>
					<Button onClick={this.submitVoteModal} center>
						Submit
					</Button>
				</Modal>
				<Modal
					isOpen={this.state.isRevealModalOpen}
					handleClose={this.toggleRevealModal}
					title="Set vote and salt"
					width="400px"></Modal>
				<Box title="Unlisted Fin4 Tokens">
					<Table headers={['Name', 'Apply']}>
						{this.state.unlistedFin4Tokens.map((entry, index) => {
							return (
								<TableRow
									key={index}
									data={{
										name: entry.label,
										apply: (
											<Button
												onClick={() => {
													this.clickedToken = entry.value;
													this.toggleApplyModal();
												}}>
												Apply
											</Button>
										)
									}}
								/>
							);
						})}
					</Table>
				</Box>
			</center>
		);
	}
}

const inputFieldStyle = {
	// copied from ContractForm
	width: '100%',
	marginBottom: '15px'
};

export default drizzleConnect(Home);
