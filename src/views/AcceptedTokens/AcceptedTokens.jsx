import React, { Component } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { RegistryAddress } from '../../config/DeployedAddresses.js';
import { getContractData, getAllActionTypes } from '../../components/Contractor';
import Button from '../../components/Button';

class AcceptedTokens extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listings: {},
			allFin4Tokens: [],
			unlistedFin4Tokens: []
		};

		getContractData(RegistryAddress, 'Registry', 'getListings').then(
			({
				0: addresses,
				1: listingsKeys,
				2: applicationExpiries,
				3: whitelistees,
				4: owners,
				5: unstakedDeposits,
				6: challengeIDs
			}) => {
				let listingsObj = [];
				let testObj;
				for (var i = 0; i < addresses.length; i++) {
					let addressFromListingKey = '0x' + listingsKeys[i].substr(26, listingsKeys[i].length - 1);
					testObj = addressFromListingKey;
					listingsObj[addressFromListingKey] = {
						address: addressFromListingKey, //addresses[i],
						listingKey: listingsKeys[i],
						applicationExpiry: applicationExpiries[i],
						whitelisted: whitelistees[i],
						owner: owners[i],
						unstakedDeposit: unstakedDeposits[i],
						challengeID: challengeIDs[i]
					};
					testObj = listingsObj[testObj];
				}
				this.setState({ listings: listingsObj });
				console.log(testObj.address);
				console.log(testObj.applicationExpiries);
				console.log(testObj.applicationExpiries);
				console.log(testObj.whitelistees);
				console.log(testObj.owner);
				console.log(testObj.unstakedDeposit);
				console.log(testObj.challengeID);

				getAllActionTypes().then(data => {
					this.setState({ allFin4Tokens: data });
					let unlistedFin4TokensArr = [];
					for (var i = 0; i < data.length; i++) {
						if (!listingsObj[data.value]) {
							unlistedFin4TokensArr.push(data[i]);
						}
					}
					this.setState({ unlistedFin4Tokens: unlistedFin4TokensArr });
				});
			}
		);
	}

	applyTokenClick = event => {
		// TODO
	};

	render() {
		return (
			<center>
				<Box title="Listings">
					<Table headers={['address', 'listingKey']}>
						{Object.keys(this.state.listings).map((key, index) => {
							return (
								<TableRow
									key={index}
									data={{
										address: this.state.listings[key].address,
										listingKey: this.state.listings[key].listingKey
									}}
								/>
							);
						})}
					</Table>
				</Box>
				<Box title="Unlisted Fin4 Tokens">
					<Table headers={['name', 'apply']}>
						{this.state.unlistedFin4Tokens.map((entry, index) => {
							return (
								<TableRow
									key={index}
									data={{
										name: entry.label,
										apply: <Button onClick={this.applyTokenClick}>Apply</Button>
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

export default AcceptedTokens;
