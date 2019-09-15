import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../components/Contractor';
import { Fin4MainAddress } from '../../config/DeployedAddresses.js';

class TypeCreation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isModalOpen: false,
			proofTypes: []
		};

		getContractData(Fin4MainAddress, 'Fin4Main', 'getProofTypes')
			.then(proofTypeAddresses => {
				return proofTypeAddresses.map(proofTypeAddress => {
					return getContractData(Fin4MainAddress, 'Fin4Main', 'getProofTypeName', [proofTypeAddress]).then(
						proofTypeName => {
							return getContractData(proofTypeAddress, proofTypeName, 'getInfo').then(
								({ 0: name, 1: description, 2: parameterForActionTypeCreatorToSetEncoded }) => {
									return {
										value: proofTypeAddress,
										label: name,
										description: description,
										paramsEncoded: parameterForActionTypeCreatorToSetEncoded,
										paramValues: {}
									};
								}
							);
						}
					);
				});
			})
			.then(data => Promise.all(data))
			.then(data => {
				this.setState({
					proofTypes: data
				});
			});
	}

	toggleModal = () => {
		this.setState({ isModalOpen: !this.state.isModalOpen });
	};

	render() {
		return (
			<>
				<Box title="Create a New Action Type">
					<ContractForm
						contractAddress={Fin4MainAddress}
						contractName="Fin4Main"
						method="createNewToken"
						multiSelectOptions={this.state.proofTypes}
						labels={['Name', 'Symbol', 'Description', 'Proof Types']}
						hideArgs={{
							paramValues: 'paramValues',
							paramValuesIndices: 'paramValuesIndices'
						}}
						helperModalTriggers={[null, null, null, this.toggleModal]}
					/>
				</Box>
				<Modal isOpen={this.state.isModalOpen} handleClose={this.toggleModal} title="Proof Types">
					<Table headers={['Name', 'Description']}>
						{this.state.proofTypes.length > 0 && (
							<>
								{this.state.proofTypes.map((item, index) => {
									return (
										<TableRow
											key={index}
											data={{
												name: item.label,
												description: item.description
											}}
										/>
									);
								})}
							</>
						)}
					</Table>
				</Modal>
			</>
		);
	}
}

TypeCreation.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(TypeCreation, mapStateToProps);
