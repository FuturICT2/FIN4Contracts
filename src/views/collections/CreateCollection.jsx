import React, { useState } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ContractForm from '../../components/ContractForm';

function CreateCollection(props, context) {
	const { t } = useTranslation();
	const [showHint, setShowHint] = useState(false);

	return (
		<Box title="Create token collection">
			<ContractForm
				contractName="Fin4Collections"
				method="createCollection"
				labels={['Collection-Name', 'Short-name (e.g. "ethz" for "ETH Zürich")', 'Description']}
				postSubmitCallback={() => setShowHint(true)}
			/>
			{showHint && (
				<center style={{ color: 'gray', fontFamily: 'arial' }}>Reload the page to see your new collection.</center>
			)}
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
