import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Tooltip from '@material-ui/core/Tooltip';
var QRCode = require('qrcode.react');

function QRModal(props) {
	const { t } = useTranslation();

	const [tooltipText, setTooltipText] = useState('Click to copy to clipboard');

	return (
		<Modal isOpen={props.isOpen} handleClose={props.handleClose} title="Your QR code" width="300px">
			<center style={{ fontFamily: 'arial', color: 'gray' }}>
				<QRCode value={props.publicAddress} size={250} />
				<br />
				<br />
				Your public address:
				<br />
				<CopyToClipboard text={props.publicAddress} onCopy={() => setTooltipText('Copied!')}>
					<Tooltip title={tooltipText}>
						<span style={{ fontSize: 'x-small' }}>
							<b>{props.publicAddress}</b>
						</span>
					</Tooltip>
				</CopyToClipboard>
			</center>
		</Modal>
	);
}

export default QRModal;
