import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import { Container, Box } from '../../Styles';
import PreviousClaims from './PreviousClaims';
import ActionClaim from './ActionClaim';
import ContractData from '../../ContractData';

class Actions extends Component {
	
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
								<li key={name}><b>{name}</b>: {description}</li>
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
		return (
			<Container>
				<div>
					<ActionClaim />

					<ContractData
						contractName="Fin4Main"
						method="getProofTypes"
						callback={this.getProofTypes}
					/>
				</div>

				<PreviousClaims />
			</Container>
		);
	}
}

export default Actions;
