import React, { useState, useRef, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import { getContractData, zeroAddress } from '../../components/Contractor';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { Radio, RadioGroup, FormControlLabel, TextField } from '@material-ui/core';
import AddressQRreader from '../../components/AddressQRreader';
import Button from '../../components/Button';

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
	const [addMemberMode, setAddMemberMode] = useState('addOne');
	const newMembersString = useRef('');

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

	const addMembers = () => {
		// TODO
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
							<span style={{ fontSize: 'x-large' }}>
								<b>{groupData.name}</b>
							</span>
							<br />
							<br />
							{groupData.userIsCreator ? (
								<>
									<span>Your group has {groupData.members.length} members:</span>
									<br />
									<Table headers={['Member', 'Action']} colWidths={[85, 15]}>
										{groupData.members.map((memberAddress, index) => {
											return (
												<TableRow
													key={'member_' + index}
													data={{
														member: <small>{memberAddress}</small>,
														actions: <small style={{ color: 'blue', textDecoration: 'underline' }}>Remove</small>
													}}
												/>
											);
										})}
									</Table>
									<br />
									<br />
									<RadioGroup
										row={true}
										onChange={e => {
											setAddMemberMode(e.target.value);
											newMembersString.current = '';
										}}
										value={addMemberMode}>
										<FormControlLabel value="addOne" control={<Radio />} label="Add a member" />
										<FormControlLabel value="addMultiple" control={<Radio />} label="Add multiple members" />
									</RadioGroup>
									<br />
									{addMemberMode === 'addOne' ? (
										<AddressQRreader
											onChange={val => (newMembersString.current = val)}
											label="Public address of new member"
										/>
									) : (
										<TextField
											label="Public addresses of new members"
											multiline
											rows="4"
											fullWidth
											variant="outlined"
											onChange={e => (newMembersString.current = e.target.value)}
										/>
									)}
									<br />
									<br />
									<Button onClick={() => addMembers()}>Add</Button>
									<br />
									<br />
								</>
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
