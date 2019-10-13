import React from 'react';
import Box from '../../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function ListCollections(props) {
	const { t } = useTranslation();

	return <Box title="Existing collections"></Box>;
}

ListCollections.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(ListCollections, mapStateToProps);
