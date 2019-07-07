import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { getContractData } from '../../components/ContractData';

class TypeCreation extends Component {
	constructor(props, context) {
		super(props);

		this.state = {
			isPopupOpen: false,
			proofTypes: []
		};

		getContractData('Fin4Main', 'Fin4Main.json', 'getProofTypes', [], context.drizzle)
			.then(proofTypeAddresses => {
				proofTypeAddresses.map(proofTypeAddress => {
					getContractData('Fin4Main', 'Fin4Main.json', 'getProofTypeName', [proofTypeAddress], context.drizzle).then(proofTypeName => {
						getContractData(proofTypeAddress, proofTypeName + '.json', 'getInfo', [], context.drizzle).then(
							({ 0: name, 1: description, 2: parameterForActionTypeCreatorToSetEncoded }) => {
								this.setState({ // via https://stackoverflow.com/a/26254086
									proofTypes: [...this.state.proofTypes, {
										value: proofTypeAddress,
										label: name,
										description: description,
										parameterForActionTypeCreatorToSetEncoded: parameterForActionTypeCreatorToSetEncoded
									}]
								  })
							}
						)
					});
				});
			});
	}

	togglePopup = () => {
		this.setState({ isPopupOpen: !this.state.isPopupOpen });
	};

	render() {
		const title = (
			<>
				<span>Create a New Action Type </span>
				<IconButton onClick={this.togglePopup}>
					<InfoIcon fontSize="small" />
				</IconButton>
			</>
		);
		return (
			<>
				<Box title={title}>
					<ContractForm
						contractName="Fin4Main"
						method="createNewToken"
						multiSelectOptions={this.state.proofTypes}
						labels={['Name', 'Symbol', 'Proof Types', 'Decimals']}
					/>
				</Box>
				<Modal isOpen={this.state.isPopupOpen} handleClose={this.togglePopup} title="Proof Types Specification">
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
