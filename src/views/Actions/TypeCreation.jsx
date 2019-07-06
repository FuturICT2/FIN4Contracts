import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import ContractData from '../../ContractData';
import { Fin4Box, Fin4Modal, Fin4Table, Fin4TableRow } from '../../Elements';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { getContractData } from '../../ContractData';

class TypeCreation extends Component {
	constructor(props, context) {
		super(props);
		// For more stages other than "then", see https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html
		// context.drizzle.contracts.Fin4Main.methods
		// 	.getProofTypes()
		// 	.call()
		// 	.then(data => {
		// 		console.log('ProofTypes on Fin4Main: ', data);
		// 	});

		this.state = {
			isPopupOpen: false,
			proofTypes: []
		};

		this.proofTypes = [];

		const proofTypes = getContractData('Fin4Main', 'getProofTypes', [], context.drizzle)
		.then(proofTypeAddresses => {
			return proofTypeAddresses.map(proofTypeAddress => {
				return getContractData(proofTypeAddress, 'getInfo', [], context.drizzle).then(
					({ 0: name, 1: description }) => {
						return {
							proofTypeAddress: proofTypeAddress,
							name: name,
							description: description
						};
					}
				);
			});
		})
		.then(data => Promise.all(data))
		.then(data => {
			for (var i = 0; i < data.length; i ++) {
				this.proofTypes.push({
					value: data[i].proofTypeAddress,
					label: data[i].name,
					description: data[i].description
				});
			}
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
				<Fin4Box title={title}>
					<ContractForm contractName="Fin4Main" method="createNewToken" multiSelectOptions={this.proofTypes} />
				</Fin4Box>
				<Fin4Modal isOpen={this.state.isPopupOpen} handleClose={this.togglePopup} title="Proof Types Specification">
					<Fin4Table headers={['Name', 'Description']}>
						{this.proofTypes.length > 0 && (
							<>
								{this.proofTypes.map((item, index) => {
										return (
											<Fin4TableRow data={{
												name: item.label,
												description: item.description
											}} />
										);
									}
								)}
							</>
						)}
					</Fin4Table>
				</Fin4Modal>
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

// export default TypeCreation;
