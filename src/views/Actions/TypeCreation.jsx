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
			var proofTypeArr = [];
			for (var i = 0; i < data.length; i ++) {
				proofTypeArr.push(data[i]);
			}
			this.setState({ proofTypes: proofTypeArr });
		});
	}

	togglePopup = () => {
		this.setState({ isPopupOpen: !this.state.isPopupOpen });
	};

	render() {
		if (this.state.proofTypes.length < 1) {
			return "Loading proof types...";
		}
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
					<ContractForm contractName="Fin4Main" method="createNewToken" />
				</Fin4Box>
				<Fin4Modal isOpen={this.state.isPopupOpen} handleClose={this.togglePopup} title="Proof Types Specification">
					<Fin4Table headers={['Name', 'Description']}>
						{this.state.proofTypes.length > 0 && (
							<>
								{this.state.proofTypes.map((item, index) => {
										return (
											<Fin4TableRow data={{
												name: item.name,
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
