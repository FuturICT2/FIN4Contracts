import React from 'react';
import Box from '../../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../../components/Container';
import PropTypes from 'prop-types';

function Collections(props) {
	const { t } = useTranslation();

	return (
		<Container>
			<Box title="Create a new collection"></Box>
			<Box title="Existing collections"></Box>
		</Container>
	);
}

Collections.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(Collections, mapStateToProps);
