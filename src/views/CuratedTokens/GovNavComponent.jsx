import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function GovNavComponent(props) {
	const { t } = useTranslation();

	return (
		<center style={{ fontFamily: 'arial' }}>
			<Link to="/governance/listing">Listing</Link>
			&nbsp;&nbsp;&nbsp;<Link to="/governance/management">Management</Link>
			&nbsp;&nbsp;&nbsp;<Link to="/governance/parameters">Parameters</Link>
		</center>
	);
}

export default GovNavComponent;
