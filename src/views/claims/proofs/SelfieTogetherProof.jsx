import React, { useRef, useState } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import AddressQRreader from '../../../components/AddressQRreader';
import Button from '../../../components/Button';
import ipfs from '../../../ipfs';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import { isValidPublicAddress } from '../../../components/Contractor';

function SelfieTogetherProof(props, context) {
	const { t } = useTranslation();

	const addressValue = useRef(null);
	const ipfsHash = useRef(null);
	const [uploadInProgress, setUploadInProgress] = useState(false);

	const onSelectFile = file => {
		setUploadInProgress(true);
		console.log('Started upload to IPFS...');
		let reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
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
			ipfsHash.current = hash;
			setUploadInProgress(false);
			console.log('Upload of ' + sizeKB + ' KB to IPFS successful: ' + hash, 'https://gateway.ipfs.io/ipfs/' + hash);
			//ipfs.pin.add(hash, function (err) {
			//	console.log("Could not pin hash " + hash, err);
			//});
		});
	};

	const onSubmit = () => {
		if (!isValidPublicAddress(addressValue.current)) {
			alert('Invalid Ethereum public address');
			return;
		}

		if (!ipfsHash.current) {
			alert('No completed upload');
			return;
		}

		context.drizzle.contracts.SelfieTogether.methods
			.submitProof_SelfieTogether(props.tokenAddr, props.claimId, addressValue.current, ipfsHash.current)
			.send({ from: props.store.getState().fin4Store.defaultAccount })
			.then(result => {
				console.log('Results of submitting: ', result);
			});
	};

	return (
		<>
			<AddressQRreader onChange={val => (addressValue.current = val)} label="Public address of selfie approver" />
			<br />
			<br />
			<center style={{ fontFamily: 'arial' }}>
				{uploadInProgress ? (
					<>
						<CircularProgress />
						&nbsp;&nbsp;&nbsp;<span style={{ color: 'gray' }}>Uploading...</span>
					</>
				) : ipfsHash.current ? (
					<>
						<CheckIcon />{' '}
						<span style={{ color: 'gray' }}>
							<a href={'https://gateway.ipfs.io/ipfs/' + ipfsHash.current} target="_blank">
								Upload complete
							</a>
						</span>
					</>
				) : (
					<input type="file" onChange={e => onSelectFile(e.target.files[0])} accept="image/png, image/jpeg" />
				)}
			</center>
			<br />
			<Button onClick={onSubmit} center="true">
				Submit
			</Button>
		</>
	);
}

SelfieTogetherProof.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(SelfieTogetherProof, mapStateToProps);
