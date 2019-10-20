import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import CreateGroup from './CreateGroup';
import ListGroups from './ListGroups';

function Groups(props, context) {
	const { t } = useTranslation();

	return (
		<Container>
			<CreateGroup />
			<ListGroups />
		</Container>
	);
}

Groups.contextTypes = {
	drizzle: PropTypes.object
};

export default drizzleConnect(Groups);
