import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';
import { TextField } from '@material-ui/core';

function StepActions(props) {
	const { t } = useTranslation();

	const [draftId, setDraftId] = useState(null);
	const actions = useRef({});

	useEffect(() => {
		if (!props.draft || draftId) {
			return;
		}
		let draft = props.draft;
		actions.current = {
			text: draft.actions.hasOwnProperty('text') ? draft.actions.text : ''
		};
		setDraftId(draft.id);
	});

	const submit = () => {
		props.dispatch({
			type: 'UPDATE_TOKEN_CREATION_DRAFT_FIELDS',
			draftId: draftId,
			lastModified: moment().valueOf(),
			nodeName: 'actions',
			node: actions.current
		});
		props.handleNext();
	};

	return (
		<>
			{draftId && (
				<>
					<TextField
						multiline
						rows="4"
						fullWidth
						variant="outlined"
						onChange={e => (actions.current.text = e.target.value)}
						defaultValue={actions.current.text}
					/>
					<br />
					<StepsBottomNav nav={props.nav} handleNext={submit} />
				</>
			)}
		</>
	);
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(StepActions, mapStateToProps);
