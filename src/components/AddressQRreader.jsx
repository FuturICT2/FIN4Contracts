import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

function AddressQRreader(props) {
	const { t, i18n } = useTranslation();

	const [isQRModalOpen, setIsQRModalOpen] = useState(false);
	const [iconIsHovered, setIconHovered] = useState(false);

	const toggleModal = () => {
		setIsQRModalOpen(!isQRModalOpen);
	};

	return (
		<>
			<TextField
				type="text"
				label="Public address"
				style={inputFieldStyle}
				variant="outlined"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<FontAwesomeIcon
								style={iconIsHovered ? QRiconHover : QRicon}
								icon={faQrcode}
								onClick={() => {}}
								onMouseEnter={() => setIconHovered(true)}
								onMouseLeave={() => setIconHovered(false)}
							/>
						</InputAdornment>
					)
				}}
			/>
			<Modal isOpen={isQRModalOpen} handleClose={toggleModal} title="Scan QR Code">
				TODO
			</Modal>
		</>
	);
}

const QRicon = {
	color: 'black',
	width: '24px',
	height: '24px',
	padding: '3px 2px 3px 1px'
};

const QRiconHover = {
	color: 'gray',
	width: '27px',
	height: '27px'
};

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(AddressQRreader, mapStateToProps);
