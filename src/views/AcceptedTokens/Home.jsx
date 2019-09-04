import React, { Component } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { RegistryAddress, PLCRVotingAddress, GOVTokenAddress } from '../../config/DeployedAddresses.js';
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

		this.resetApplyModalValues();
		this.resetVoteModalValues();

		this.parameterizerValues = {
			// TODO load this into redux store
			minDeposit: null,
			reviewTax: null
		};

		getContractData(RegistryAddress, 'Registry', 'parameterizer').then(parameterizerAddress => {
			getContractData(parameterizerAddress, 'Parameterizer', 'get', ['minDeposit']).then(minDepositBN => {
				this.parameterizerValues.minDeposit = new BN(minDepositBN).toNumber();
			});
			getContractData(parameterizerAddress, 'Parameterizer', 'get', ['reviewTax']).then(reviewTaxBN => {
				this.parameterizerValues.reviewTax = new BN(reviewTaxBN).toNumber();
			});
		});

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

	// ---------- ApplyModal ----------

	resetApplyModalValues() {
		this.applyModalValues = {
			token: null, // address
			deposit: null, // number
			data: null // string
		};
	}

	toggleApplyModal = () => {
		if (this.state.isApplyModalOpen) {
			this.resetApplyModalValues();
		}
		this.setState({ isApplyModalOpen: !this.state.isApplyModalOpen });
	};

	submitApplyModal = () => {
		if (this.applyModalValues.deposit === null || this.applyModalValues.data === null) {
			alert('Both values must be set.');
			return;
		}

		let currentAccount = window.web3.currentProvider.selectedAddress;
		let token = this.applyModalValues.token;
		let deposit = Number(this.applyModalValues.deposit);
		let data = this.applyModalValues.data;

		let minDepositPlusReviewTax = this.parameterizerValues.minDeposit + this.parameterizerValues.reviewTax;
		if (deposit < minDepositPlusReviewTax) {
			alert('Deposit must be bigger than minDeposit + reviewTax (=' + minDepositPlusReviewTax + ')');
			return;
		}

		this.toggleApplyModal();

		// Step 1: approve

		getContract(GOVTokenAddress, 'GOV')
			.then(function(instance) {
				return instance.approve(RegistryAddress, deposit, {
					from: currentAccount
				});
			})
			.then(function(result) {
				console.log('GOV.approve Result: ', result);

				// Step 2: applyToken

				getContract(RegistryAddress, 'Registry')
					.then(function(instance) {
						return instance.applyToken(token, deposit, data, {
							from: currentAccount
						});
					})
					.then(function(result) {
						console.log('Registry.applyToken Result: ', result);
					})
					.catch(function(err) {
						console.log('Registry.applyToken Error: ', err.message);
					});
			})
			.catch(function(err) {
				console.log('GOV.approve Error: ', err.message);
			});
	};

	// ---------- VoteModal ----------

	resetVoteModalValues() {
		this.voteModalValues = {
			pollID: null, // number
			vote: null, // number
			salt: null, // number
			numbTokens: null // number
		};
	}

	toggleVoteModal = () => {
		if (this.state.isVoteModalOpen) {
			this.resetVoteModalValues();
		}
		this.setState({ isVoteModalOpen: !this.state.isVoteModalOpen });
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
		let numbTokens = Number(this.voteModalValues.numbTokens);
		let pollID = this.voteModalValues.pollID;

		if (numbTokens < 0) {
			alert('Number of tokens must be more than 0.');
			return;
		}

		this.toggleVoteModal();

		getContract(GOVTokenAddress, 'GOV')
			.then(function(instance) {
				return instance.approve(PLCRVotingAddress, numbTokens, {
					from: currentAccount
				});
			})
			.then(function(result) {
				console.log('GOV.approve Result: ', result);

				getContractData(PLCRVotingAddress, 'PLCRVoting', 'getInsertPointForNumTokens', [
					currentAccount,
					numbTokens,
					pollID
				]).then(prevPollIdBN => {
					let prevPollID = new BN(prevPollIdBN).toNumber();
					let secretHash = soliditySha3(vote, salt);
					getContract(PLCRVotingAddress, 'PLCRVoting')
						.then(function(instance) {
							return instance.commitVote(pollID, secretHash, numbTokens, prevPollID, {
								from: currentAccount
							});
						})
						.then(function(result) {
							console.log('PLCRVoting.commitVote Result: ', result);
						})
						.catch(function(err) {
							console.log('PLCRVoting.commitVote Error: ', err.message);
						});
				});
			})
			.catch(function(err) {
				console.log('GOV.approve Error: ', err.message);
			});
	};

	// ---------- RevealModal ----------

	toggleRevealModal = () => {
		this.setState({ isRevealModalOpen: !this.state.isRevealModalOpen });
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
													this.voteModalValues.pollID = this.state.listings[key].challengeID;
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
													this.applyModalValues.token = entry.value;
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
				<Modal
					isOpen={this.state.isApplyModalOpen}
					handleClose={this.toggleApplyModal}
					title="Set deposit and data"
					width="400px">
					<TextField
						key="apply-deposit"
						type="number"
						label="Deposit"
						onChange={e => (this.applyModalValues.deposit = e.target.value)}
						style={inputFieldStyle}
					/>
					<TextField
						key="apply-data"
						type="text"
						label="Data"
						onChange={e => (this.applyModalValues.data = e.target.value)}
						style={inputFieldStyle}
					/>
					<Button onClick={this.submitApplyModal} center>
						Submit
					</Button>
					<center>
						<small style={{ color: 'gray' }}>
							Upon submitting, two transactions have to be signed: to allow the deposit to be withdrawn from your GOV
							token balance and then to submit the application for this token.
						</small>
					</center>
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
					<center>
						<small style={{ color: 'gray' }}>
							Upon submitting, two transactions have to be signed: to allow the number of tokens to be withdrawn from
							your GOV token balance and then to submit your vote.
						</small>
					</center>
				</Modal>
				<Modal
					isOpen={this.state.isRevealModalOpen}
					handleClose={this.toggleRevealModal}
					title="Set vote and salt"
					width="400px"></Modal>
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
