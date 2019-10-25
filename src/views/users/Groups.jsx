import React, { useState, useRef, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import Button from '../../components/Button';
import { getContractData } from '../../components/Contractor';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';

function Groups(props, context) {
	const { t } = useTranslation();
	const groupsContractReady = useRef(false);
	const [showHint, setShowHint] = useState(false);
	const [groups, setGroups] = useState([]);
	const values = useRef({
		name: null,
		addCreator: false
	});

	useEffect(() => {
		if (!groupsContractReady.current && props.contracts.Fin4Groups && props.contracts.Fin4Groups.initialized) {
			groupsContractReady.current = true;
			fetchGroups();
		}
	});

	const fetchGroups = () => {
		let defaultAccount = props.store.getState().fin4Store.defaultAccount;
		getContractData(context.drizzle.contracts.Fin4Groups, defaultAccount, 'getGroupsInfo').then(
			({ 0: userIsCreatorArr, 1: userIsMemberArr }) => {
				let groupsArr = [];
				for (let i = 0; i < userIsCreatorArr.length; i++) {
					let userIsCreator = userIsCreatorArr[i];
					let userIsMember = userIsMemberArr[i];
					if (userIsCreator || userIsMember) {
						groupsArr.push({
							groupId: i,
							userIsCreator: userIsCreator,
							userIsMember: userIsMember,
							name: null,
							creator: null
						});
					}
				}
				let promises = [];
				for (let i = 0; i < groupsArr.length; i++) {
					promises.push(
						getContractData(
							context.drizzle.contracts.Fin4Groups,
							defaultAccount,
							'getGroupNameAndCreator',
							groupsArr[i].groupId
						).then(({ 0: groupName, 1: groupCreator }) => {
							groupsArr[i].name = groupName;
							groupsArr[i].creator = groupCreator;
						})
					);
				}
				// TODO multiple setGroups would be nicer to show stuff early and let names load asynchron
				// didn't figure it out in reasonable time though
				Promise.all(promises).then(() => setGroups(groupsArr));
			}
		);
	};

	const submitNewGroup = () => {
		let val = values.current;
		if (val.name === null || val.name.length < 3) {
			alert('Group name invalid');
			return;
		}
		context.drizzle.contracts.Fin4Groups.methods
			.createGroup(val.name, val.addCreator)
			.send({
				from: props.store.getState().fin4Store.defaultAccount
			})
			.then(function(result) {
				console.log('Results of submitting: ', result);
				setShowHint(true);
			});
	};

	return (
		<Container>
			<Box title="Create a group">
				<TextField
					key="name-field"
					type="text"
					label="Group name"
					onChange={e => (values.current.name = e.target.value)}
					style={inputFieldStyle}
				/>
				<FormControlLabel
					control={
						<Checkbox
							label="Add yourself as member"
							key="addCreator-field"
							onChange={() => {
								values.current.addCreator = !values.current.addCreator;
							}}
						/>
					}
					label={<span style={{ color: 'gray' }}>Add yourself as member</span>}
				/>
				<Button onClick={submitNewGroup} center="true">
					Submit
				</Button>
				{showHint && (
					<center style={{ color: 'gray', fontFamily: 'arial' }}>Reload the page to see your new group.</center>
				)}
			</Box>
			{groups.filter(group => group.userIsCreator).length > 0 && (
				<Box title="Groups you created">
					<Table headers={['Group name', 'Actions']} colWidths={[85, 15]}>
						{groups
							.filter(g => g.userIsCreator)
							.map((group, index) => {
								return (
									<TableRow
										key={'groupCreator_' + index}
										data={{
											name: group.name,
											actions: 'TODO'
										}}
									/>
								);
							})}
					</Table>
				</Box>
			)}
			{groups.filter(group => group.userIsMember).length > 0 && (
				<Box title="Groups you are a member of">
					<Table headers={['Group name', 'Actions']} colWidths={[85, 15]}>
						{groups
							.filter(g => g.userIsMember)
							.map((group, index) => {
								return (
									<TableRow
										key={'groupMember_' + index}
										data={{
											name: group.name,
											actions: 'TODO'
										}}
									/>
								);
							})}
					</Table>
				</Box>
			)}
		</Container>
	);
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

Groups.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(Groups, mapStateToProps);
