import React, { useState, useRef, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';

function GroupEdit(props, context) {
	const { t } = useTranslation();

	const groupsContractReady = useRef(false);
	const [groupId, setGroupId] = useState(null);

	useEffect(() => {
		let groupIdViaURL = props.match.params.groupId;
		if (!groupId && groupIdViaURL) {
			setGroupId(groupIdViaURL);
		}

		if (
			groupId &&
			!groupsContractReady.current &&
			props.contracts.Fin4Groups &&
			props.contracts.Fin4Groups.initialized
		) {
			groupsContractReady.current = true;
			fetchGroup(groupId);
		}
	});

	const fetchGroup = gId => {
		// TODO
	};

	return (
		<Container>
			<Box title="Edit group"></Box>
		</Container>
	);
}

GroupEdit.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(GroupEdit, mapStateToProps);
