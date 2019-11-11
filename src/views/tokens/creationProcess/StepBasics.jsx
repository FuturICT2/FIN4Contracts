import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { TextField } from '@material-ui/core';
import StepsBottomNav from './StepsBottomNav';

function StepBasics(props) {
	const { t } = useTranslation();

	const [draftId, setDraftId] = useState(null);

	const fields = useRef({
		name: '',
		symbol: '',
		description: '',
		lastModified: ''
	});

	useEffect(() => {
		if (draftId || !props.draft) {
			return;
		}
		let draft = props.draft;
		fields.current = {
			name: draft.name && draft.name.length > 0 ? draft.name : '',
			symbol: draft.symbol && draft.symbol.length > 0 ? draft.symbol : '',
			description: draft.description && draft.description.length > 0 ? draft.description : '',
			lastModified: draft.lastModified
		};
		setDraftId(draft.id);
	});

	const submit = () => {
		fields.current.lastModified = moment().valueOf(); // TODO only set that if actual changes took place: compare
		props.dispatch({
			type: 'UPDATE_TOKEN_CREATION_DRAFT_FIELDS',
			draftId: draftId,
			fields: fields.current
		});
		props.handleNext();
	};

	return (
		<>
			{draftId && (
				<>
					<TextField
						key="name-field"
						type="text"
						label="Name"
						defaultValue={fields.current.name}
						onChange={e => (fields.current.name = e.target.value)}
						style={inputFieldStyle}
					/>
					<TextField
						key="symbol-field"
						type="text"
						label="Symbol"
						defaultValue={fields.current.symbol}
						onChange={e => (fields.current.symbol = e.target.value)}
						style={inputFieldStyle}
					/>
					<TextField
						key="description-field"
						type="text"
						label="Description"
						defaultValue={fields.current.description}
						onChange={e => (fields.current.description = e.target.value)}
						style={inputFieldStyle}
					/>
					<StepsBottomNav nav={props.nav} handleNext={submit} />
				</>
			)}
		</>
	);
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(StepBasics, mapStateToProps);
