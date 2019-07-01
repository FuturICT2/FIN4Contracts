import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import ContractData from '../../ContractData';
import { Box } from '../../Styles';

class TypeCreation extends Component {
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

export default TypeCreation;
