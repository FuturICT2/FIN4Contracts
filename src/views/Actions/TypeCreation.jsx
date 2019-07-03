import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import ContractData from '../../ContractData';
import { Fin4Box, Fin4Modal, Fin4Table, Fin4TableRow } from '../../Elements';
// import { drizzleConnect } from 'drizzle-react';
// import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

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
			isPopupOpen: false
		};
	}

	togglePopup = () => {
		this.setState({ isPopupOpen: !this.state.isPopupOpen });
	};

	showProofTypeSpecification = data => {
		return (
			<Fin4Table headers={['Name', 'Description']}>
				{data &&
					data.map((address, index) => {
						return (
							<ContractData
								key={index}
								contractAddress={address}
								method="getInfo"
								callback={data => <Fin4TableRow data={data} />}
							/>
						);
					})}
			</Fin4Table>
		);
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
					<ContractForm contractName="Fin4Main" method="createNewToken" />
				</Fin4Box>
				<Fin4Modal isOpen={this.state.isPopupOpen} handleClose={this.togglePopup} title="Proof Types Specification">
					<ContractData contractName="Fin4Main" method="getProofTypes" callback={this.showProofTypeSpecification} />
				</Fin4Modal>
			</>
		);
	}
}

// TypeCreation.contextTypes = {
// 	drizzle: PropTypes.object
// };

// const mapStateToProps = state => {
// 	return {
// 		contracts: state.contracts
// 	};
// };

// export default drizzleConnect(TypeCreation, mapStateToProps);

export default TypeCreation;
