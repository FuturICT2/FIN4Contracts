import React from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function CreateGroup(props, context) {
	const { t } = useTranslation();

	return <Box title="Create group"></Box>;
}

CreateGroup.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(CreateGroup, mapStateToProps);
