import React, { useState, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';

function UserSite(props) {
	const { t, i18n } = useTranslation();

	const [userAddressViaURL, setUserAddressViaURL] = useState(null);

	useEffect(() => {
		let userAddress = props.match.params.userAddress;
		if (!userAddressViaURL && userAddress) {
			setUserAddressViaURL(userAddress);
		}
	});

	return (
		<Container>
			<Box title="User Actions">TODO</Box>
		</Container>
	);
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(UserSite, mapStateToProps);
