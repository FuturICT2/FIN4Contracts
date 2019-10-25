import React, { useState, useRef, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';

function Groups(props, context) {
	const { t } = useTranslation();
	const groupsContractReady = useRef(false);

	useEffect(() => {
		if (!groupsContractReady.current && props.contracts.Fin4Groups && props.contracts.Fin4Groups.initialized) {
			groupsContractReady.current = true;
			fetchGroups();
		}
	});

	const fetchGroups = () => {
		// TODO
	};

	return (
		<Container>
			<Box title="Create a group"></Box>
			<Box title="Groups you created"></Box>
			<Box title="Groups you are a member of"></Box>
		</Container>
	);
}

Groups.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(Groups, mapStateToProps);
