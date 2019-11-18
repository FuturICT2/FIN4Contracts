import React, { useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import AddressQRreader from '../../../components/AddressQRreader';
import { TextField } from '@material-ui/core';
import { isValidPublicAddress } from '../../../components/Contractor';
import Button from '../../../components/Button';

function NetworkingProof(props, context) {
	const { t } = useTranslation();

	const submit = () => {
		let approver = addressValue.current;
		if (!isValidPublicAddress(approver)) {
			alert('Invalid Ethereum public address');
			return;
		}
		let content = contentValue.current;
		context.drizzle.contracts.Networking.methods
			.submitProof(props.tokenAddr, props.claimId, approver, content)
			.send({ from: props.store.getState().fin4Store.defaultAccount })
			.then(result => {
				console.log('Results of submitting Networking.submitProof: ', result);
			});
	};

	const addressValue = useRef(null);
	const contentValue = useRef('');

	return (
		<>
			<AddressQRreader onChange={val => (addressValue.current = val)} label="Public address of approver" />
			<br />
			<div style={{ fontFamily: 'arial', color: 'gray' }}>Snippets from your interaction:</div>
			<br />
			<TextField
				multiline
				rows="2"
				fullWidth
				variant="outlined"
				onChange={e => (contentValue.current = e.target.value)}
			/>
			<br />
			<Button onClick={submit} center="true">
				Submit
			</Button>
		</>
	);
}

NetworkingProof.contextTypes = {
	drizzle: PropTypes.object
};

export default drizzleConnect(NetworkingProof);
