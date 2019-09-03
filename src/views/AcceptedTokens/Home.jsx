import React, { Component } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { RegistryAddress } from '../../config/DeployedAddresses.js';
import { getContractData, getAllActionTypes } from '../../components/Contractor';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { TextField } from '@material-ui/core';
import { drizzleConnect } from 'drizzle-react';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isApplyModalOpen: false,
			listings: {},
			allFin4Tokens: [],
			unlistedFin4Tokens: []
		};

		this.resetApplyModalValues();

		getContractData(RegistryAddress, 'Registry', 'getListings').then(
			({
				0: listingsKeys,
				1: applicationExpiries,
				2: whitelistees,
				3: owners,
				4: unstakedDeposits,
				5: challengeIDs
			}) => {
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
						challengeID: challengeIDs[i],
						name: ''
					};
				}

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

	resetApplyModalValues() {
		// holds the values from the apply-popup until submit is pressed
		this.applyModalValues = {
			token: null, // address
			deposit: null, // number
			data: null // string
		};
	}

	applyTokenClick = token => {
		this.setState({ isApplyModalOpen: true });
		this.applyModalValues.token = token;
	};

	cancelApplyModal = () => {
		this.setState({
			isApplyModalOpen: false
		});
		this.resetApplyModalValues();
	};

	submitApplyModal = () => {
		if (this.applyModalValues.deposit === null || this.applyModalValues.data === null) {
			alert('Both values must be set.');
			this.resetApplyModalValues();
			return;
		}
		this.setState({
			isApplyModalOpen: false
		});

		// TODO registry.applyToken(theToken, deposit, description);

		this.resetApplyModalValues();
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
										status: 'TODO',
										dueDate: 'TODO',
										actions: 'TODO'
									}}
								/>
							);
						})}
					</Table>
				</Box>
				<Modal
					isOpen={this.state.isApplyModalOpen}
					handleClose={this.cancelApplyModal}
					title="Set deposit and data"
					width="400px">
					<TextField
						key="apply-deposit"
						type="number"
						label="deposit"
						onChange={e => (this.applyModalValues.deposit = e.target.value)}
						style={inputFieldStyle}
					/>
					<TextField
						key="apply-data"
						type="text"
						label="data"
						onChange={e => (this.applyModalValues.data = e.target.value)}
						style={inputFieldStyle}
					/>
					<Button onClick={this.submitApplyModal} center>
						Submit
					</Button>
				</Modal>
				<Box title="Unlisted Fin4 Tokens">
					<Table headers={['Name', 'Apply']}>
						{this.state.unlistedFin4Tokens.map((entry, index) => {
							return (
								<TableRow
									key={index}
									data={{
										name: entry.label,
										apply: <Button onClick={() => this.applyTokenClick(entry.value)}>Apply</Button>
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
