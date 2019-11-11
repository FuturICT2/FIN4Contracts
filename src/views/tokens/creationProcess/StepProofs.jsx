import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

function StepProofs(props) {
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
		props.addSubmitCallback('Proofs', submit);
	});

	const submit = () => {
		fields.current.lastModified = moment().valueOf();
		// TODO
	};

	return <>{draftId && <></>}</>;
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(StepProofs, mapStateToProps);
