import React, { Component } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { RegistryAddress } from '../../config/DeployedAddresses.js';
import { getContractData, getAllActionTypes } from '../../components/Contractor';

class AcceptedTokens extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listings: {},
			allFin4Tokens: [],
			unlistedFin4Tokens: []
		};

		getContractData(RegistryAddress, 'Registry', 'getListings').then(({ 0: addresses, 1: listingsKeys }) => {
			let listingsObj = [];
			for (var i = 0; i < addresses.length; i++) {
				listingsObj[addresses[i]] = {
					address: addresses[i],
					listingKey: listingsKeys[i]
				};
			}
			this.setState({ listings: listingsObj });

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
		});
	}

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
			</center>
		);
	}
}

export default AcceptedTokens;
