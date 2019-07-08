import React, { Component } from 'react';
import { Typography, Divider } from '@material-ui/core';
import ContractData from '../../components/ContractData';
import ContractForm from '../../components/ContractForm';
import styled from 'styled-components';
import colors from '../../config/colors-config';

class ProofSubmission extends Component {
	requiredProofTypeAddresses = ({ 7: requiredProofTypes, 8: proofTypeStatuses }) => {
		this.proofTypeStatusesObj = {};
		for (var i = 0; i < requiredProofTypes.length; i++) {
			this.proofTypeStatusesObj[requiredProofTypes[i]] = {};
			this.proofTypeStatusesObj[requiredProofTypes[i]].approved = proofTypeStatuses[i];
		}

		this.getProofTypeInfoAndShowForm = ({ 0: address, 1: name, 2: description, 3: submitProofMethodArgsCount }) => {
			const isApproved = this.proofTypeStatusesObj[address].approved;

			return (
				<>
					<Status isApproved={isApproved}>
						{isApproved
							? `The proof "${name}" was submitted successfully.`
							: `Your claim requires you to fill out the following form: ${description}.`}
					</Status>
					{!isApproved && (
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
					)}
				</>
			);
		};

		return (
			<>
				{requiredProofTypes.map((address, index) => {
					return (
						<>
							{index > 0 && <Divider variant="middle" style={{ margin: '50px 0' }} />}
							<ContractData
								key={index}
								contractName="Fin4Main"
								method="getProofTypeInfo"
								methodArgs={[address]}
								callback={this.getProofTypeInfoAndShowForm}
							/>
						</>
					);
				})}
			</>
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

const Status = styled(Typography)`
	&& {
		background: ${props => (props.isApproved ? colors.true : colors.wrong)};
		padding: 10px;
		margin: 20px 0;
		box-sizing: border-box;
		border-radius: 4px;
	}
`;

export default ProofSubmission;
