import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import CreateCollection from './CreateCollection';
import ListCollections from './ListCollections';

function Collections(props) {
	const { t } = useTranslation();

	return (
		<Container>
			<CreateCollection />
			<ListCollections />
		</Container>
	);
}

Collections.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(Collections, mapStateToProps);
