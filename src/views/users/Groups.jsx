import React, { useState, useRef, useEffect } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import Button from '../../components/Button';

function Groups(props, context) {
	const { t } = useTranslation();
	const groupsContractReady = useRef(false);
	const [showHint, setShowHint] = useState(false);
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
		// TODO
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
			<Box title="Groups you created"></Box>
			<Box title="Groups you are a member of"></Box>
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
