import React from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';

function User(props, context) {
	const { t } = useTranslation();

	return <Container></Container>;
}

User.contextTypes = {
	drizzle: PropTypes.object
};

export default drizzleConnect(User);
