import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
var QRCode = require('qrcode.react');

function QRModal(props) {
	const { t } = useTranslation();

	return (
		<Modal isOpen={props.isOpen} handleClose={props.handleClose} title="Your QR code" width="300px">
			<center style={{ fontFamily: 'arial', color: 'gray' }}>
				<QRCode value={props.publicAddress} size={250} />
				<br />
				<br />
				Your public address:
				<br />
				<span style={{ fontSize: 'x-small' }}>{props.publicAddress}</span>
			</center>
		</Modal>
	);
}

export default QRModal;
