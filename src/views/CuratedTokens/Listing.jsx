import React, { useState, useEffect, useRef } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
//import { RegistryAddress, GOVTokenAddress } from '../../config/DeployedAddresses.js';
import {
	getCurrentAccount,
	getContractData,
	getAllActionTypes,
	getContract,
	getPollStatus,
	PollStatus,
	fetchTCRparameters
} from '../../components/Contractor';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { drizzleConnect } from 'drizzle-react';
import { TextField } from '@material-ui/core';
import VoteModal from './VoteModal';
import RevealModal from './RevealModal';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const BN = require('bignumber.js');

function Listing(props, context) {
	const { t } = useTranslation();

	const [isApplyModalOpen, setApplyModalOpen] = useState(false);
	const [isVoteModalOpen, setVoteModalOpen] = useState(false);
	const [isRevealModalOpen, setRevealModalOpen] = useState(false);
	const [isChallengeModalOpen, setChallengeModalOpen] = useState(false);

	const [listings, setListings] = useState({});

	const applyModalValues = useRef({
		token: null,
		deposit: null,
		data: null
	});

	const challengeModalValues = useRef({
		data: null
	});

	const selectedListing = useRef(null);

	let listingsFetched = useRef(false);

	useEffect(() => {
		// this method guards itself against to ensure it's only executed once
		fetchTCRparameters(props.contracts, props, context.drizzle);

		if (
			!listingsFetched.current &&
			props.fin4TokensInitiallyFetched &&
			props.contracts.Registry &&
			props.contracts.Registry.initialized
		) {
			listingsFetched.current = true;
			fetchListings();
		}
	});

	const fetchListings = () => {
		let defaultAccount = props.store.getState().fin4Store.defaultAccount;

		getContractData(context.drizzle.contracts.Registry, defaultAccount, 'getListings').then(
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
					let whitelisted = whitelistees[i];
					let challengeID = new BN(challengeIDs[i]).toNumber();

					if (!whitelisted && challengeID === 0) {
						// has been voted out / rejected
						continue;
					}

					listingsObj[address] = {
						address: address,
						listingKey: listingsKeys[i],
						applicationExpiry: applicationExpiries[i],
						whitelisted: whitelisted,
						owner: owners[i],
						unstakedDeposit: unstakedDeposits[i],
						challengeID: challengeID,
						name: '',
						status: '',
						actionStatus: Action_Status.UNDEFINED,
						dueDate: ''
					};
				}

				getContractData(context.drizzle.contracts.Registry, defaultAccount, 'getChallenges').then(
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

							let review_challenge = challengesObj[challengeID].isReview ? 'Review' : 'Challenge';

							return getPollStatus(challengeID, context.drizzle.contracts.PLCRVoting, defaultAccount).then(
								pollStatus => {
									listing.dueDate = pollStatus.dueDate;

									switch (pollStatus.inPeriod) {
										case PollStatus.IN_COMMIT_PERIOD:
											listing.actionStatus = Action_Status.VOTE;
											listing.status = review_challenge + ': commit period';
											return;
										case PollStatus.IN_REVEAL_PERIOD:
											listing.actionStatus = Action_Status.REVEAL;
											listing.status = review_challenge + ': reveal period';
											return;
										case PollStatus.PAST_REVEAL_PERIOD:
											listing.actionStatus = Action_Status.UPDATE;
											listing.status = review_challenge;
											break;
									}
								}
							);
						});
					}
				);

				// set isOPAT flag on tokens
				for (var tokenAddress in props.fin4Tokens) {
					if (props.fin4Tokens.hasOwnProperty(tokenAddress)) {
						// addresses are case in-sensitive. the address-to-byte32 method in Registry.applyToken() leaves only lower-case
						props.fin4Tokens[tokenAddress].isOPAT = listingsObj[tokenAddress.toLowerCase()] ? true : false;
					}
				}

				setListings(listingsObj);
			}
		);
	};

	// ---------- ApplyModal ----------

	const resetApplyModalValues = () => {
		applyModalValues.current = {
			token: null, // address
			deposit: null, // number
			data: null // string
		};
	};

	const toggleApplyModal = () => {
		if (isApplyModalOpen) {
			resetApplyModalValues();
		}
		setApplyModalOpen(!isApplyModalOpen);
	};

	const submitApplyModal = () => {
		if (applyModalValues.current.deposit === null || applyModalValues.current.data === null) {
			alert('Both values must be set.');
			return;
		}

		let token = applyModalValues.current.token;
		let deposit = Number(applyModalValues.current.deposit);
		let data = applyModalValues.current.data;

		let minDepositPlusReviewTax = props.parameterizerParams['minDeposit'] + props.parameterizerParams['reviewTax'];
		if (deposit < minDepositPlusReviewTax) {
			alert('Deposit must be bigger than minDeposit + reviewTax (=' + minDepositPlusReviewTax + ')');
			return;
		}

		toggleApplyModal();

		// Step 1: approve
		/*
		getContract(GOVTokenAddress, 'GOV')
			.then(function(instance) {
				return instance.approve(RegistryAddress, deposit, {
					from: getCurrentAccount()
				});
			})
			.then(function(result) {
				console.log('GOV.approve Result: ', result);

				// Step 2: applyToken

				getContract(RegistryAddress, 'Registry')
					.then(function(instance) {
						return instance.applyToken(token, deposit, data, {
							from: getCurrentAccount()
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
*/
	};

	// ---------- VoteModal ----------

	const toggleVoteModal = () => {
		setVoteModalOpen(!isVoteModalOpen);
	};

	// ---------- RevealModal ----------

	const toggleRevealModal = () => {
		setRevealModalOpen(!isRevealModalOpen);
	};

	// ---------- ChallengeModal ----------

	const resetChallengeModalValues = () => {
		challengeModalValues.current = {
			data: null // string
		};
	};

	const toggleChallengeModal = () => {
		if (isChallengeModalOpen) {
			resetChallengeModalValues();
		}
		setChallengeModalOpen(!isChallengeModalOpen);
	};

	const submitChallengeModal = () => {
		let listingHash = selectedListing.current.listingKey;
		let data = challengeModalValues.current.data;
		let minDeposit = props.parameterizerParams['minDeposit'];

		toggleChallengeModal();
		/*
		getContract(GOVTokenAddress, 'GOV')
			.then(function(instance) {
				return instance.approve(RegistryAddress, minDeposit, {
					from: getCurrentAccount()
				});
			})
			.then(function(result) {
				console.log('GOV.approve Result: ', result);
				getContract(RegistryAddress, 'Registry')
					.then(function(instance) {
						return instance.challenge(listingHash, data, {
							from: getCurrentAccount()
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
*/
	};

	// ----------

	const updateStatus = () => {
		/*
		let listingKey = this.selectedListing.listingKey;
		getContract(RegistryAddress, 'Registry')
			.then(function(instance) {
				return instance.updateStatus(listingKey, {
					from: getCurrentAccount()
				});
			})
			.then(function(result) {
				console.log('RegistryAddress.updateStatus Result: ', result);
			})
			.catch(function(err) {
				console.log('RegistryAddress.updateStatus Error: ', err.message);
				alert(err.message);
			});
*/
	};

	return (
		<center>
			<Box title="Curated Positive Action Tokens" width="800px">
				<Table headers={['Name', 'Status', 'Due Date', 'Actions', 'Whitelisted']}>
					{Object.keys(listings).map((key, index) => {
						// key is address of the Fin4Token
						return (
							<TableRow
								key={index}
								data={{
									name: listings[key].name,
									status: listings[key].status,
									dueDate: listings[key].dueDate,
									actions: listings[key].actionStatus !== Action_Status.REJECTED && (
										<Button
											onClick={() => {
												selectedListing.current = listings[key];
												switch (listings[key].actionStatus) {
													case Action_Status.VOTE:
														toggleVoteModal();
														break;
													case Action_Status.REVEAL:
														toggleRevealModal();
														break;
													case Action_Status.UPDATE:
														updateStatus();
														break;
													case Action_Status.CHALLENGE:
														toggleChallengeModal();
														break;
												}
											}}>
											{listings[key].actionStatus}
										</Button>
									),
									whitelisted: listings[key].whitelisted.toString()
								}}
							/>
						);
					})}
				</Table>
			</Box>
			<Box title="All Positive Action Tokens">
				{!props.fin4TokensInitiallyFetched ? (
					<span style={{ fontFamily: 'arial', color: 'gray' }}>Loading...</span>
				) : (
					<Table headers={['Name', 'Apply']}>
						{Object.keys(props.fin4Tokens).map((key, index) => {
							let token = props.fin4Tokens[key];
							return (
								<TableRow
									key={index}
									data={{
										name: token.name,
										apply: token.isOPAT ? (
											'Is on the curated list'
										) : (
											<Button
												onClick={() => {
													applyModalValues.current.token = token.address;
													toggleApplyModal();
												}}>
												Apply
											</Button>
										)
									}}
								/>
							);
						})}
					</Table>
				)}
			</Box>
			<Modal isOpen={isApplyModalOpen} handleClose={toggleApplyModal} title="Set deposit and data" width="400px">
				<TextField
					key="apply-deposit"
					type="number"
					label="Deposit"
					onChange={e => (applyModalValues.current.deposit = e.target.value)}
					style={inputFieldStyle}
				/>
				<TextField
					key="apply-data"
					type="text"
					label="Data"
					onChange={e => (applyModalValues.current.data = e.target.value)}
					style={inputFieldStyle}
				/>
				<Button onClick={submitApplyModal} center="true">
					Submit
				</Button>
				<center>
					<small style={{ color: 'gray' }}>
						Upon submitting, two transactions have to be signed: to allow the deposit to be withdrawn from your GOV
						token balance and then to submit the application for this token.
					</small>
				</center>
			</Modal>
			<VoteModal
				isOpen={isVoteModalOpen}
				handleClose={toggleVoteModal}
				pollID={selectedListing.current && selectedListing.current.challengeID}
				voteOptionsInfo={
					selectedListing.current && selectedListing.current.whitelisted
						? 'Challenge: 1 = keep token on the list, 0 = remove it'
						: 'Review: 1 = put token on list, 0 = reject application'
				}
			/>
			<RevealModal
				isOpen={isRevealModalOpen}
				handleClose={toggleRevealModal}
				pollID={selectedListing.current && selectedListing.current.challengeID}
			/>
			<Modal isOpen={isChallengeModalOpen} handleClose={toggleChallengeModal} title="Add optional data" width="400px">
				<TextField
					key="set-data"
					type="text"
					label="Data"
					onChange={e => (challengeModalValues.current.data = e.target.value)}
					style={inputFieldStyle}
				/>
				<Button onClick={submitChallengeModal} center="true">
					Submit
				</Button>
				<center>
					<small style={{ color: 'gray' }}>
						Upon submitting, two transactions have to be signed: to allow minDeposit (
						{props.parameterizerParams['minDeposit'] ? props.parameterizerParams['minDeposit'] : '?'}) to be withdrawn
						from your GOV token balance and then to submit your challenge.
					</small>
				</center>
			</Modal>
		</center>
	);
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

Listing.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		fin4Tokens: state.fin4Store.fin4Tokens,
		fin4TokensInitiallyFetched: state.fin4Store.fin4TokensInitiallyFetched,
		parameterizerParams: state.fin4Store.parameterizerParams
	};
};

export default drizzleConnect(Listing, mapStateToProps);
