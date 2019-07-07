import React, { Component } from 'react';
import Box from '../../components/Box';
import ContractData from '../../components/ContractData';
import ContractForm from '../../components/ContractForm';

class ProofSubmission extends Component {
	requiredProofTypeAddresses = ({
		0: tokenName,
		1: tokenSymbol,
		3: isApproved,
		4: quantity,
		5: date,
		6: comment,
		7: requiredProofTypes,
		8: proofTypeStatuses
	}) => {
		this.proofTypeStatusesObj = {};
		for (var i = 0; i < requiredProofTypes.length; i++) {
			this.proofTypeStatusesObj[requiredProofTypes[i]] = {};
			this.proofTypeStatusesObj[requiredProofTypes[i]].approved = proofTypeStatuses[i];
		}

		this.getProofTypeInfoAndShowForm = ({ 0: address, 1: name, 2: description, 3: submitProofMethodArgsCount }) => {
			var info = (
				<span>
					<b>{name}</b>: {description}
					<br></br>
					<i>{address}</i>
				</span>
			);

			if (this.proofTypeStatusesObj[address].approved) {
				return (
					<div>
						{info}
						<br></br>
						<br></br>
						<font color="green">
							<b>Proof type approved</b>
						</font>
					</div>
				);
			}

			return (
				<div>
					{info}
					<br></br>
					<br></br>
					<font color="red">
						<b>Proof type not approved yet</b>
					</font>
					<Box title={'Initiate proof for ' + name}>
						<ContractForm
							contractAddress={address}
							contractJson={name + '.json'}
							method="submitProof"
							// submitProof() occurs multiple times with different args in ProofTypes that inherit from each other.
							// ContractForm would just take the first one in the abi that matches the method-name. Thats why another
							// identifier is necessary to pick the right method. Probably by specific types would be even better.
							methodArgsCount={submitProofMethodArgsCount}
							fixArgs={{
								tokenAdrToReceiveProof: this.props.tokenAddress,
								claimId: this.props.claimId + ''
							}}
						/>
					</Box>
				</div>
			);
		};

		this.proofTypes = requiredProofTypes.map((address, index) => {
			return (
				<div key={'div_' + index}>
					<hr></hr>
					<span key={index}>
						<ContractData
							contractName="Fin4Main"
							method="getProofTypeInfo"
							methodArgs={[address]}
							callback={this.getProofTypeInfoAndShowForm}
						/>
						<br></br>
						<br></br>
					</span>
				</div>
			);
		});

		return (
			<div>
				Claim <i>{this.props.claimId}</i> on action type <b>{tokenName}</b> [{tokenSymbol}]{' '}
				<i>{this.props.tokenAddress}</i>
				<br></br>
				<br></br>
				isApproved: <i>{isApproved + ''}</i>, quantity: <i>{quantity}</i>, date: <i>{date}</i>, comment:{' '}
				<i>{comment}</i>
				<br></br>
				<br></br>
				{this.proofTypes}
			</div>
		);
	};

	render() {
		return (
			<ContractData
				contractAddress={this.props.tokenAddress}
				method="getClaim"
				methodArgs={[this.props.claimId]}
				callback={this.requiredProofTypeAddresses}
			/>
		);
	}
}

export default ProofSubmission;
