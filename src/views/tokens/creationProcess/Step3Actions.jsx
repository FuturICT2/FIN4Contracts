import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';
import { TextField } from '@material-ui/core';

function StepActions(props) {
	const { t } = useTranslation();

	const [draftId, setDraftId] = useState(null);

	const fields = useRef({
		// ...
		lastModified: ''
	});

	useEffect(() => {
		if (!props.draft || draftId) {
			return;
		}
		let draft = props.draft;
		fields.current = {
			// ...
			lastModified: draft.lastModified
		};
		setDraftId(draft.id);
	});

	const submit = () => {
		fields.current.lastModified = moment().valueOf();
		// TODO
		props.handleNext();
	};

	return (
		<>
			{draftId && (
				<>
					<TextField label="" multiline rows="4" fullWidth variant="outlined" onChange={e => {}} />
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
