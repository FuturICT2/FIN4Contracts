import React, { useState, useEffect } from 'react';
import { Typography, Divider } from '@material-ui/core';
import ContractForm from '../../components/ContractForm';
import styled from 'styled-components';
import colors from '../../config/colors-config';
import { drizzleConnect } from 'drizzle-react';
import { findTokenBySymbol } from '../../components/Contractor';
import ipfs from '../../ipfs';
import Box from '../../components/Box';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import LocationProof from './proofs/LocationProof';
import SelfieTogetherProof from './proofs/SelfieTogetherProof';

function ProofSubmission(props, context) {
	const [ipfsHash, setIpfsHash] = useState(null);
	const [pseudoClaimId, setPseudoClaimId] = useState(null);

	useEffect(() => {
		let symbol = props.match.params.tokenSymbol;
		if (
			!pseudoClaimId &&
			Object.keys(props.fin4Tokens).length > 0 &&
			Object.keys(props.proofTypes).length > 0 &&
			symbol
		) {
			let token = findTokenBySymbol(props, symbol);
			if (!token) {
				return;
			}
			let claimId = props.match.params.claimId;
			let _pseudoClaimId = token.address + '_' + claimId;
			if (props.usersClaims[_pseudoClaimId]) {
				// acts as barrier to wait until usersClaims is available
				setPseudoClaimId(_pseudoClaimId);
			}
		}
	});

	const onUploadImageClick = event => {
		console.log('Started upload to IPFS...');
		let reader = new window.FileReader();
		reader.readAsArrayBuffer(event.target.files[0]);
		reader.onloadend = () => convertToBuffer(reader);
	};

	const convertToBuffer = async reader => {
		const buffer = await Buffer.from(reader.result);
		saveToIpfs(buffer);
	};

	const saveToIpfs = async buffer => {
		ipfs.add(buffer, (err, result) => {
			let hash = result[0].hash;
			let sizeKB = Math.round(result[0].size / 1000);
			setIpfsHash(hash);
			alert('Upload of ' + sizeKB + ' KB to IPFS successful');
			console.log('Upload of ' + sizeKB + ' KB to IPFS successful: ' + hash, 'https://gateway.ipfs.io/ipfs/' + hash);
			//ipfs.pin.add(hash, function (err) {
			//	console.log("Could not pin hash " + hash, err);
			//});
		});
	};

	const buildProofSubmissionForm = (proofTypeName, tokenAddrToReceiveProof, claimId, index) => {
		switch (proofTypeName) {
			case 'Location':
				return <LocationProof key={'loc_' + index} tokenAddr={tokenAddrToReceiveProof} claimId={claimId} />;
			case 'SelfieTogether':
				return <SelfieTogetherProof key={'selfie_' + index} tokenAddr={tokenAddrToReceiveProof} claimId={claimId} />;
			default:
				return (
					<ContractForm
						contractName={proofTypeName}
						method={'submitProof_' + proofTypeName}
						staticArgs={{
							tokenAdrToReceiveProof: tokenAddrToReceiveProof,
							claimId: claimId + ''
						}}
						buttonLabel="Initiate proof"
						specialFields={{
							IPFShash: {
								type: 'file',
								buttonText: 'Upload image to IPFS',
								buttonIcon: null,
								onClick: onUploadImageClick,
								values: {
									IPFShash: ipfsHash
								}
								//state: this.state
							}
						}}
					/>
				);
		}
	};

	return (
		pseudoClaimId && (
			<Container>
				<Box title="Proof Submission">
					{Object.keys(props.usersClaims[pseudoClaimId].proofStatuses).map((proofTypeAddr, index) => {
						let claim = props.usersClaims[pseudoClaimId];
						let proofIsApproved = claim.proofStatuses[proofTypeAddr];
						let proofObj = props.proofTypes[proofTypeAddr];
						return (
							<div key={index}>
								{index > 0 && <Divider variant="middle" style={{ margin: '50px 0' }} />}
								{proofIsApproved ? (
									<Status isapproved="true">{'The proof ' + proofObj.label + ' was submitted successfully.'}</Status>
								) : (
									<>
										<Status isapproved="false">
											{'Your claim requires you to provide the following proof: ' + proofObj.description}
										</Status>
										{buildProofSubmissionForm(proofObj.label, claim.token, claim.claimId, index)}
									</>
								)}
							</div>
						);
					})}
				</Box>
			</Container>
		)
	);
}

const Status = styled(Typography)`
	&& {
		background: ${props => (props.isapproved === 'true' ? colors.true : colors.wrong)};
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
		usersClaims: state.fin4Store.usersClaims,
		fin4Tokens: state.fin4Store.fin4Tokens,
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(ProofSubmission, mapStateToProps);
