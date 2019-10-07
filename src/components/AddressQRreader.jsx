import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';

function AddressQRreader(props) {
	const { t, i18n } = useTranslation();

	const [isQRModalOpen, setIsQRModalOpen] = useState(false);

	const toggleModal = () => {
		setIsQRModalOpen(!isQRModalOpen);
	};

	return <></>;
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(AddressQRreader, mapStateToProps);
