import React, { Component } from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { RegistryAddress } from '../../config/DeployedAddresses.js';

class AcceptedTokens extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listings: [
				{
					name: 'foo1',
					info: 'info1'
				},
				{
					name: 'foo2',
					info: 'info2'
				}
			]
		};

		/*
		getContractData(RegistryAddress, 'Registry', 'getListings').then(listings => {
			// TODO setState
		});
		*/
	}

	render() {
		return (
			<center>
				<Box title="Listings">
					<Table headers={['Name', 'Info']}>
						{this.state.listings.map((entry, index) => {
							return (
								<TableRow
									key={index}
									data={{
										name: entry.name,
										info: entry.info
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