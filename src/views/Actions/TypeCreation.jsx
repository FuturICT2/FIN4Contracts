import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import ContractData from '../../ContractData';
import { Box } from '../../Styles';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

class TypeCreation extends Component {
	constructor(props, context) {
		super(props);
		// For more stages other than "then", see https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html
		context.drizzle.contracts.Fin4Main.methods.getProofTypes().call().then((data) => { 
			console.log("ProofTypes on Fin4Main: ", data);
		});
	}

	getProofTypes = data => {
		const proofTypes =
			data &&
			data.map((address, index) => {
				return (
					<ContractData
						key={index}
						contractAddress={address}
						method="getInfo"
						callback={({ 0: name, 1: description }) => {
							return (
								<li key={name}>
									<b>{name}</b>: {description}
								</li>
							);
						}}
					/>
				);
			});
		return (
			<>
				<Box title="Create a New Action Type">
					<ContractForm contractName="Fin4Main" method="createNewToken" />
				</Box>
				<Box title="Available proof types">
					<ul>{proofTypes}</ul>
				</Box>
			</>
		);
	};

	render() {
		return <ContractData contractName="Fin4Main" method="getProofTypes" callback={this.getProofTypes} />;
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
