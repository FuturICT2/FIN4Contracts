import React, { Component } from 'react';
import { Typography, Divider } from '@material-ui/core';
import ContractForm from '../../components/ContractForm';
import styled from 'styled-components';
import colors from '../../config/colors-config';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../components/ContractData';

class ProofSubmission extends Component {
	constructor(props, context) {
		super(props);

		this.state = {
			proofData: null
		};

		getContractData(this.props.tokenAddress, 'Fin4Token.json', 'getClaim', [this.props.claimId], context.drizzle)
			.then(({ 7: requiredProofTypes, 8: proofTypeStatuses }) => {
				var proofTypeStatusesObj = {};
				for (var i = 0; i < requiredProofTypes.length; i++) {
					proofTypeStatusesObj[requiredProofTypes[i]] = {};
					proofTypeStatusesObj[requiredProofTypes[i]].isApproved = proofTypeStatuses[i];
				}
				return requiredProofTypes.map((address, index) => {
					return getContractData(
						address,
						'Fin4BaseProofType.json',
						'getParameterizedInfo',
						[this.props.tokenAddress],
						context.drizzle
					).then(({ 0: name, 1: parameterizedDescription, 2: submitProofMethodArgsCount }) => {
						return {
							address: address,
							name: name,
							description: parameterizedDescription,
							submitProofMethodArgsCount: submitProofMethodArgsCount,
							isApproved: proofTypeStatusesObj[address].isApproved
						};
					});
				});
			})
			.then(data => Promise.all(data))
			.then(data => {
				this.setState({ proofData: data });
			});
	}

	render() {
		if (this.state.proofData === null) {
			return '';
		}
		return (
			<>
				{this.state.proofData.map((proofObj, index) => {
					return (
						<div key={index}>
							{index > 0 && <Divider variant="middle" style={{ margin: '50px 0' }} />}
							<Status isApproved={proofObj.isApproved}>
								{proofObj.isApproved
									? `The proof "${proofObj.name}" was submitted successfully.`
									: `Your claim requires you to fill out the following form: ${proofObj.description}.`}
							</Status>
							{!proofObj.isApproved && (
								<ContractForm
									contractAddress={proofObj.address}
									contractJson={proofObj.name + '.json'}
									method="submitProof"
									// submitProof() occurs multiple times with different args in ProofTypes that inherit from each other.
									// ContractForm would just take the first one in the abi that matches the method-name. Thats why another
									// identifier is necessary to pick the right method. Probably by specific types would be even better.
									methodArgsCount={proofObj.submitProofMethodArgsCount}
									fixArgs={{
										tokenAdrToReceiveProof: this.props.tokenAddress,
										claimId: this.props.claimId + ''
									}}
								/>
							)}
						</div>
					);
				})}
			</>
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

ProofSubmission.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(ProofSubmission, mapStateToProps);
