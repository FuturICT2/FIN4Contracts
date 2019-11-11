import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';

function StepTraits(props) {
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
					<StepsBottomNav nav={props.nav} handleNext={submit} />
				</>
			)}
		</>
	);
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(StepTraits, mapStateToProps);
