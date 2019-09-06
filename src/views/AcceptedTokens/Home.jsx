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
			isChallengeModalOpen: false,

			listings: {},
			allFin4Tokens: [],
			unlistedFin4Tokens: []
		};

		this.resetApplyModalValues();
		this.resetVoteModalValues();
		this.resetChallengeModalValues();

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
						actionStatus: Action_Status.UNDEFINED,
						commitEndDate: '',
						revealEndDate: ''
					};
				}

				getContractData(RegistryAddress, 'Registry', 'getChallenges').then(
					({ 0: challengeIDs, 1: rewardPools, 2: challengers, 3: isReviews, 4: isResolveds, 5: totalTokenss }) => {
						let challengesObj = {};
						for (var i = 0; i < challengeIDs.length; i++) {
							let challengeID = new BN(challengeIDs[i]).toNumber();
							challengesObj[challengeID] = {
								challengeID: challengeID,
								rewardPool: new BN(rewardPools[i]).toString(),
								challenger: challengers[i],
								isReview: isReviews[i],
								isResolved: isResolveds[i],
								totalTokens: new BN(totalTokenss[i]).toString()
							};
						}

						let allPollPromises = Object.keys(listingsObj).map(tokenAddr => {
							let listing = listingsObj[tokenAddr];
							let challengeID = listing.challengeID;

							if (!listing.whitelisted && challengeID === 0) {
								listing.actionStatus = Action_Status.REJECTED;
								listing.status = 'Rejected / Voted out';
								return;
							}

							if (challengesObj[challengeID].isResolved) {
								listing.actionStatus = Action_Status.CHALLENGE;
								listing.status = '-';
								return;
							}

							return getContractData(PLCRVotingAddress, 'PLCRVoting', 'pollMap', [challengeID]).then(
								({ 0: commitEndDateBN, 1: revealEndDateBN, 2: voteQuorum, 3: votesFor, 4: votesAgainst }) => {
									let commitEndDate = new BN(commitEndDateBN).toNumber() * 1000;
									let revealEndDate = new BN(revealEndDateBN).toNumber() * 1000;

									listing.commitEndDate = new Date(commitEndDate).toLocaleString('de-CH-1996');
									listing.revealEndDate = new Date(revealEndDate).toLocaleString('de-CH-1996');
									let nowTimestamp = Date.now();
									let inCommitPeriod = commitEndDate - nowTimestamp > 0;
									let inRevealPeriod = !inCommitPeriod && revealEndDate - nowTimestamp > 0;

									let review_challenge = challengesObj[challengeID].isReview ? 'Review' : 'Challenge';

									if (inCommitPeriod) {
										listing.actionStatus = Action_Status.VOTE;
										listing.status = review_challenge + ': commit period';
										return;
									}

									if (inRevealPeriod) {
										// no longer inCommitPeriod
										listing.actionStatus = Action_Status.REVEAL;
										listing.status = review_challenge + ': reveal period';
										return;
									}

									listing.actionStatus = Action_Status.UPDATE;
									listing.status = review_challenge;
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
						alert(err.message);
					});
			})
			.catch(function(err) {
				console.log('GOV.approve Error: ', err.message);
				alert(err.message);
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
							alert(err.message);
						});
				});
			})
			.catch(function(err) {
				console.log('GOV.approve Error: ', err.message);
				alert(err.message);
			});
	};

	// ---------- RevealModal ----------

	toggleRevealModal = () => {
		if (this.state.isRevealModalOpen) {
			this.resetVoteModalValues(); // is used to store the pollID from modal-opening click to submission
		}
		this.setState({ isRevealModalOpen: !this.state.isRevealModalOpen });
	};

	// ---------- ChallengeModal ----------

	resetChallengeModalValues() {
		this.challengeModalValues = {
			listingHash: null, // ?
			data: null // string
		};
	}

	toggleChallengeModal = () => {
		if (this.state.isChallengeModalOpen) {
			this.resetChallengeModalValues();
		}
		this.setState({ isChallengeModalOpen: !this.state.isChallengeModalOpen });
	};

	submitChallengeModal = () => {
		let currentAccount = window.web3.currentProvider.selectedAddress;
		let listingHash = this.challengeModalValues.listingHash;
		let data = this.challengeModalValues.data;
		let minDeposit = this.parameterizerValues.minDeposit;

		this.toggleChallengeModal();

		getContract(GOVTokenAddress, 'GOV')
			.then(function(instance) {
				return instance.approve(RegistryAddress, minDeposit, {
					from: currentAccount
				});
			})
			.then(function(result) {
				console.log('GOV.approve Result: ', result);
				getContract(RegistryAddress, 'Registry')
					.then(function(instance) {
						return instance.challenge(listingHash, data, {
							from: currentAccount
						});
					})
					.then(function(result) {
						console.log('Registry.challenge Result: ', result);
					})
					.catch(function(err) {
						console.log('Registry.challenge Error: ', err.message);
						alert(err.message);
					});
			})
			.catch(function(err) {
				console.log('GOV.approve Error: ', err.message);
				alert(err.message);
			});
	};

	// ----------

	updateStatus(tokenAddr) {
		let currentAccount = window.web3.currentProvider.selectedAddress;
		let listingKey = this.state.listings[tokenAddr].listingKey;
		getContract(RegistryAddress, 'Registry')
			.then(function(instance) {
				return instance.updateStatus(listingKey, {
					from: currentAccount
				});
			})
			.then(function(result) {
				console.log('RegistryAddress.updateStatus Result: ', result);
			})
			.catch(function(err) {
				console.log('RegistryAddress.updateStatus Error: ', err.message);
				alert(err.message);
			});
	}

	determineDueDateEntry(listing) {
		switch (listing.actionStatus) {
			case Action_Status.VOTE:
				return listing.commitEndDate;
			case Action_Status.REVEAL:
				return listing.revealEndDate;
			case Action_Status.UPDATE:
			case Action_Status.CHALLENGE:
			case Action_Status.REJECTED:
				return '-';
		}
	}

	render() {
		return (
			<center>
				<Box title="Listings" width="800px">
					<Table headers={['Name', 'Status', 'Due Date', 'Actions', 'Whitelisted']}>
						{Object.keys(this.state.listings).map((key, index) => {
							// key is address of the Fin4Token
							return (
								<TableRow
									key={index}
									data={{
										name: this.state.listings[key].name,
										status: this.state.listings[key].status,
										dueDate: this.determineDueDateEntry(this.state.listings[key]),
										actions: this.state.listings[key].actionStatus !== Action_Status.REJECTED && (
											<Button
												onClick={() => {
													switch (this.state.listings[key].actionStatus) {
														case Action_Status.VOTE:
															this.voteModalValues.pollID = this.state.listings[key].challengeID;
															this.toggleVoteModal();
															break;
														case Action_Status.REVEAL:
															this.voteModalValues.pollID = this.state.listings[key].challengeID;
															this.toggleRevealModal();
															break;
														case Action_Status.UPDATE:
															this.updateStatus(key); // direct transaction call, no popup first
															break;
														case Action_Status.CHALLENGE:
															this.challengeModalValues.listingHash = this.state.listings[key].listingKey;
															this.toggleChallengeModal();
															break;
													}
												}}>
												{this.state.listings[key].actionStatus}
											</Button>
										),
										whitelisted: this.state.listings[key].whitelisted.toString()
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
					width="400px">
					<ContractForm
						contractAddress={PLCRVotingAddress}
						contractName="PLCRVoting"
						method="revealVote"
						labels={['_pollID', 'Vote', 'Salt']}
						staticArgs={{
							_pollID: this.voteModalValues.pollID
						}}
						postSubmitCallback={(success, result) => {
							if (!success) {
								alert(result.message);
							}
							this.toggleRevealModal();
						}}
					/>
				</Modal>
				<Modal
					isOpen={this.state.isChallengeModalOpen}
					handleClose={this.toggleChallengeModal}
					title="Add optional data"
					width="400px">
					<TextField
						key="set-data"
						type="text"
						label="Data"
						onChange={e => (this.challengeModalValues.data = e.target.value)}
						style={inputFieldStyle}
					/>
					<Button onClick={this.submitChallengeModal} center>
						Submit
					</Button>
					<center>
						<small style={{ color: 'gray' }}>
							Upon submitting, two transactions have to be signed: to allow minDeposit (
							{this.parameterizerValues.minDeposit === null ? '?' : this.parameterizerValues.minDeposit}) to be
							withdrawn from your GOV token balance and then to submit your challenge.
						</small>
					</center>
				</Modal>
			</center>
		);
	}
}

const Action_Status = {
	UNDEFINED: 'Undefined',
	VOTE: 'Vote', // = commit
	REVEAL: 'Reveal',
	UPDATE: 'Update',
	CHALLENGE: 'Challenge',
	REJECTED: 'Rejected'
};

const inputFieldStyle = {
	// copied from ContractForm
	width: '100%',
	marginBottom: '15px'
};

export default drizzleConnect(Home);
