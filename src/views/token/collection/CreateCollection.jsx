import React from 'react';
import Box from '../../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function CreateCollection(props, context) {
	const { t } = useTranslation();

	return <Box title="Create a new collection"></Box>;
}

CreateCollection.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(CreateCollection, mapStateToProps);
