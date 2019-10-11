import React from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';

function UserTransfer(props, context) {
	const { t } = useTranslation();

	return (
		<Container>
			<Box title="Send tokens to user"></Box>
		</Container>
	);
}

UserTransfer.contextTypes = {
	drizzle: PropTypes.object
};

export default drizzleConnect(UserTransfer);
