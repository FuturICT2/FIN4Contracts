import React from 'react';
import Box from '../../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ContractForm from '../../../components/ContractForm';

function CreateCollection(props, context) {
	const { t } = useTranslation();

	return (
		<Box title="Create a new collection">
			<ContractForm contractName="Fin4Collections" method="createCollection" />
		</Box>
	);
}

CreateCollection.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(CreateCollection, mapStateToProps);
