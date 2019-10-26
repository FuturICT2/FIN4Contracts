import React, { useState, useRef, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import { getContractData, zeroAddress } from '../../components/Contractor';

function GroupEdit(props, context) {
	const { t } = useTranslation();

	const groupsContractReady = useRef(false);
	const [groupId, setGroupId] = useState(null);
	const [groupData, setGroupData] = useState({
		creator: null,
		members: [],
		name: null,
		userIsCreator: null
	});

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
		let defaultAccount = props.store.getState().fin4Store.defaultAccount;
		getContractData(context.drizzle.contracts.Fin4Groups, defaultAccount, 'getGroup', gId).then(
			({ 0: creator, 1: members, 2: name }) => {
				setGroupData({
					creator: creator,
					members: members,
					name: name,
					userIsCreator: creator === defaultAccount
				});
			}
		);
	};

	return (
		<Container>
			<Box title="Edit group">
				<center style={{ fontFamily: 'arial' }}>
					{groupData.creator === null ? (
						<span>Loading...</span>
					) : groupData.creator === zeroAddress ? (
						<span style={{ color: 'red' }}>Invalid group Id: {groupId}</span>
					) : (
						<>
							<b>{groupData.name}</b>
							<br />
							<br />
							{groupData.userIsCreator ? (
								<span>TODO</span>
							) : (
								<span style={{ color: 'red' }}>You have no editing rights for this group</span>
							)}
						</>
					)}
				</center>
			</Box>
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
