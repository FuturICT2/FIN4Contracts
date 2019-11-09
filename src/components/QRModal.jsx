import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
				<CopyToClipboard text={props.publicAddress} onCopy={() => {}}>
					<span title="Click to copy to clipboard" style={{ fontSize: 'x-small' }}>
						{props.publicAddress}
					</span>
				</CopyToClipboard>
			</center>
		</Modal>
	);
}

export default QRModal;
