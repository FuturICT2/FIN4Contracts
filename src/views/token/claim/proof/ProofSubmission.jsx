import React, { Component } from 'react';
import { Typography, Divider } from '@material-ui/core';
import ContractForm from '../../../../components/ContractForm';
import styled from 'styled-components';
import colors from '../../../../config/colors-config';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../../../components/Contractor';
import ipfs from '../../../../ipfs';
import AddLocation from '@material-ui/icons/AddLocation';

class ProofSubmission extends Component {
	constructor(props) {
		super(props);
		this.ipfsApi = ipfs;
		this.state = {
			proofData: null,
			ipfsHash: null,
			buffer: '',
			ethAddress: '',
			blockNumber: '',
			transactionHash: '',
			gasUsed: '',
			txReceipt: ''
		};
		/*
		let pseudoClaimId = this.props.tokenAddress + '_' + this.props.claimId;
		let claim = props.usersClaims[pseudoClaimId];
		Object.keys(claim.proofStatuses).map(proofTypeAddr => {
			let isApproved = claim.proofStatuses[proofTypeAddr];
			getContractData(props, proofTypeAddr, 'Fin4BaseProofType', 'getParameterizedInfo', this.props.tokenAddress)
				.then(({ 0: name, 1: parameterizedDescription, 2: paramValues }) => {
					return {
						address: proofTypeAddr,
						name: name,
						description: parameterizedDescription,
						paramValues: paramValues,
						isApproved: isApproved
					};
				})
		});
		*/

		getContractData(props, this.props.tokenAddress, 'Fin4Token', 'getClaim', this.props.claimId)
			.then(({ 7: requiredProofTypes, 8: proofTypeStatuses }) => {
				var proofTypeStatusesObj = {};
				for (var i = 0; i < requiredProofTypes.length; i++) {
					proofTypeStatusesObj[requiredProofTypes[i]] = {};
					proofTypeStatusesObj[requiredProofTypes[i]].isApproved = proofTypeStatuses[i];
				}
				return requiredProofTypes.map((address, index) => {
					return getContractData(
						props,
						address,
						'Fin4BaseProofType',
						'getParameterizedInfo',
						this.props.tokenAddress
					).then(({ 0: name, 1: parameterizedDescription, 2: paramValues }) => {
						return {
							address: address,
							name: name,
							description: parameterizedDescription,
							paramValues: paramValues,
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

	onUploadImageClick = event => {
		console.log('Started upload to IPFS...');
		let reader = new window.FileReader();
		reader.readAsArrayBuffer(event.target.files[0]);
		reader.onloadend = () => this.convertToBuffer(reader);
	};

	convertToBuffer = async reader => {
		const buffer = await Buffer.from(reader.result);
		this.saveToIpfs(buffer);
	};

	saveToIpfs = async buffer => {
		this.ipfsApi.add(buffer, (err, result) => {
			let hash = result[0].hash;
			let sizeKB = Math.round(result[0].size / 1000);
			this.setState({ ipfsHash: hash });
			alert('Upload of ' + sizeKB + ' KB to IPFS successful');
			console.log('Upload of ' + sizeKB + ' KB to IPFS successful: ' + hash, 'https://gateway.ipfs.io/ipfs/' + hash);
			//this.ipfsApi.pin.add(hash, function (err) {
			//	console.log("Could not pin hash " + hash, err);
			//});
		});
	};

	onSubmitLocationClick = specialFieldObj => {
		const positionCallback = position => {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;

			alert('Captured location ' + latitude + ' / ' + longitude);

			var multiplier = 10000000;

			var tokenCreatorLatitude = Number(specialFieldObj.data.paramValues[0]) / multiplier;
			var tokenCreatorLongitude = Number(specialFieldObj.data.paramValues[1]) / multiplier;

			// use an oracle instead!? Maybe http://provable.xyz
			var distanceToTokenCreatorsLocation = Math.round(
				distanceInKmBetweenEarthCoordinates(tokenCreatorLatitude, tokenCreatorLongitude, latitude, longitude) * 1000
			);

			// console.log(latitude, longitude, tokenCreatorLatitude, tokenCreatorLongitude, distanceToTokenCreatorsLocation);

			specialFieldObj.values = {
				latitude: Math.round(latitude * multiplier).toString(),
				longitude: Math.round(longitude * multiplier).toString(),
				distanceToLocation: distanceToTokenCreatorsLocation.toString()
			};
		};
		if (navigator.geolocation) {
			// via https://www.w3schools.com/html/html5_geolocation.asp
			navigator.geolocation.getCurrentPosition(positionCallback);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	};

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
							<Status isapproved={proofObj.isApproved ? 'true' : 'false'}>
								{proofObj.isApproved
									? `The proof "${proofObj.name}" was submitted successfully.`
									: `Your claim requires you to fill out the following form: ${proofObj.description}`}
							</Status>
							{!proofObj.isApproved && (
								<ContractForm
									contractAddress={proofObj.address}
									contractName={proofObj.name}
									method={'submitProof_' + proofObj.name}
									staticArgs={{
										tokenAdrToReceiveProof: this.props.tokenAddress,
										claimId: this.props.claimId + ''
									}}
									hideArgs={{
										longitude: 'longitude',
										distanceToLocation: 'distanceToLocation'
									}}
									buttonLabel="Initiate proof"
									specialFields={{
										// location: "location" // TODO latitude/longitude... ?!
										IPFShash: {
											type: 'file',
											buttonText: 'Upload image to IPFS',
											buttonIcon: null,
											onClick: this.onUploadImageClick,
											values: {
												IPFShash: this.state.ipfsHash
											},
											state: this.state
										},
										latitude: {
											buttonText: 'Submit location',
											buttonIcon: AddLocation,
											onClick: this.onSubmitLocationClick,
											data: proofObj,
											values: {
												latitude: '0',
												longitude: '0',
												distanceToLocation: '999999'
											}
										},
										longitude: {
											belongsTo: 'latitude'
										},
										distanceToLocation: {
											belongsTo: 'latitude'
										}
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

function degreesToRadians(degrees) {
	return (degrees * Math.PI) / 180;
}

// from https://stackoverflow.com/a/365853
function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
	var earthRadiusKm = 6371;

	var dLat = degreesToRadians(lat2 - lat1);
	var dLon = degreesToRadians(lon2 - lon1);

	lat1 = degreesToRadians(lat1);
	lat2 = degreesToRadians(lat2);

	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return earthRadiusKm * c;
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
		contracts: state.contracts,
		usersClaims: state.fin4Store.usersClaims
	};
};

export default drizzleConnect(ProofSubmission, mapStateToProps);
