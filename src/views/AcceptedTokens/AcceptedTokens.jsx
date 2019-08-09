import React, { Component } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { RegistryAddress } from '../../config/DeployedAddresses.js';
import { getContractData } from '../../components/Contractor';

class AcceptedTokens extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listings: [
				{
					address: 'foo1',
					listingKey: 'info1'
				},
				{
					address: 'foo2',
					listingKey: 'info2'
				}
			]
		};

		getContractData(RegistryAddress, 'Registry', 'getListings').then(({ 0: addresses, 1: listingsKeys }) => {
			let listingsArr = [];
			for (var i = 0; i < addresses.length; i++) {
				listingsArr.push({
					address: addresses[i],
					listingKey: listingsKeys[i]
				});
			}
			this.setState({ listings: listingsArr });
		});
	}

	render() {
		return (
			<center>
				<Box title="Listings">
					<Table headers={['address', 'listingKey']}>
						{this.state.listings.map((entry, index) => {
							return (
								<TableRow
									key={index}
									data={{
										address: entry.address,
										listingKey: entry.listingKey
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
