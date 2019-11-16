import React from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';

function ProofTypes(props, context) {
	const { t } = useTranslation();

	return (
		<Container>
			<Box title="Proof types"></Box>
		</Container>
	);
}

ProofTypes.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(ProofTypes, mapStateToProps);
