import React, { Component } from 'react';
import { PLCRVotingAddress, GOVTokenAddress } from '../../config/DeployedAddresses.js';
import { getCurrentAccount, getContractData, getContract } from '../../components/Contractor';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { drizzleConnect } from 'drizzle-react';
import { TextField } from '@material-ui/core';
const { soliditySha3 } = require('web3-utils');
const BN = require('bignumber.js');

class VoteModal extends Component {
	constructor(props) {
		super(props);
		this.resetVoteModalValues();
	}

	resetVoteModalValues() {
		this.voteModalValues = {
			vote: null,
			salt: null,
			numbTokens: null
		};
	}

	submitVoteModal = () => {
		if (
			this.voteModalValues.vote === null ||
			this.voteModalValues.salt === null ||
			this.voteModalValues.numbTokens === null
		) {
			alert('All values must be set.');
			return;
		}

		let vote = this.voteModalValues.vote;
		let salt = this.voteModalValues.salt;
		let numbTokens = Number(this.voteModalValues.numbTokens);
		let pollID = this.props.pollID;

		if (numbTokens < 0) {
			alert('Number of tokens must be more than 0.');
			return;
		}

		this.resetVoteModalValues();
		this.props.handleClose();

		getContract(GOVTokenAddress, 'GOV')
			.then(function(instance) {
				return instance.approve(PLCRVotingAddress, numbTokens, {
					from: getCurrentAccount()
				});
			})
			.then(function(result) {
				console.log('GOV.approve Result: ', result);

				getContractData_deprecated(PLCRVotingAddress, 'PLCRVoting', 'getInsertPointForNumTokens', [
					getCurrentAccount(),
					numbTokens,
					pollID
				]).then(prevPollIdBN => {
					let prevPollID = new BN(prevPollIdBN).toNumber();
					let secretHash = soliditySha3(vote, salt);
					getContract(PLCRVotingAddress, 'PLCRVoting')
						.then(function(instance) {
							return instance.commitVote(pollID, secretHash, numbTokens, prevPollID, {
								from: getCurrentAccount()
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

	render() {
		return (
			<center>
				<Modal
					isOpen={this.props.isOpen}
					handleClose={this.props.handleClose}
					title="Set vote, salt and number of tokens"
					width="400px">
					<TextField
						key="set-vote"
						type="number"
						label="Vote (1 or 0)"
						onChange={e => (this.voteModalValues.vote = e.target.value)}
						style={inputFieldStyle}
					/>
					<small style={{ color: 'gray' }}>{this.props.voteOptionsInfo}</small>
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
					<Button onClick={this.submitVoteModal} center="true">
						Submit
					</Button>
					<center>
						<small style={{ color: 'gray' }}>
							Upon submitting, two transactions have to be signed: to allow the number of tokens to be withdrawn from
							your GOV token balance and then to submit your vote.
						</small>
					</center>
				</Modal>
			</center>
		);
	}
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

export default drizzleConnect(VoteModal);
