import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';

// put these somewhere central? #ConceptualDecision
const PROPERTY_DEFAULT = {
	isTransferable: true,
	isMintable: true,
	isBurnable: false,
	isCapped: false,
	cap: null,
	decimals: 0,
	initialSupply: 0
};

function StepTraits(props) {
	const { t } = useTranslation();

	const [draftId, setDraftId] = useState(null);

	const fields = useRef({});

	const getValue = (draft, prop) => {
		return draft.properties.hasOwnProperty(prop) ? draft.properties[prop] : PROPERTY_DEFAULT[prop];
	};

	useEffect(() => {
		if (!props.draft || draftId) {
			return;
		}

		let draft = props.draft;

		fields.current.properties = {
			cap: getValue(draft, 'cap'),
			decimals: getValue(draft, 'decimals'),
			initialSupply: getValue(draft, 'initialSupply')
		};

		setCheckboxes({
			isTransferable: getValue(draft, 'isTransferable'),
			isMintable: getValue(draft, 'isMintable'),
			isBurnable: getValue(draft, 'isBurnable'),
			isCapped: getValue(draft, 'isCapped')
		});

		setDraftId(draft.id);
	});

	const submit = () => {
		fields.current.lastModified = moment().valueOf();
		for (var fieldName in checkboxes) {
			if (checkboxes.hasOwnProperty(fieldName)) {
				fields.current.properties[fieldName] = checkboxes[fieldName];
			}
		}
		props.dispatch({
			type: 'UPDATE_TOKEN_CREATION_DRAFT_FIELDS',
			draftId: draftId,
			fields: fields.current
		});
		props.handleNext();
	};

	const [checkboxes, setCheckboxes] = useState({});

	const buildCheckboxWithInfo = (label, fieldName, onChange) => {
		return (
			<>
				<FormControlLabel
					control={
						<Checkbox
							checked={checkboxes[fieldName]}
							onChange={() => {
								if (onChange) {
									onChange();
								}
								setCheckboxes({
									...checkboxes,
									[fieldName]: !checkboxes[fieldName]
								});
							}}
						/>
					}
					label={label}
				/>
				<br />
			</>
		);
	};

	return (
		<>
			{draftId && (
				<>
					<div style={{ padding: '10px 0 0 85px' }}>
						{buildCheckboxWithInfo('is transferable', 'isTransferable')}
						{buildCheckboxWithInfo('is mintable', 'isMintable')}
						{buildCheckboxWithInfo('is burnable', 'isBurnable')}
						{buildCheckboxWithInfo('is capped', 'isCapped', () => {
							if (checkboxes['isCapped']) {
								fields.current.properties.cap = null;
							}
						})}
						<TextField
							disabled={!checkboxes['isCapped']}
							type="number"
							label="Cap"
							style={styles.numberField}
							defaultValue={fields.current.properties.cap}
							onChange={e => (fields.current.properties.cap = e.target.value)}
						/>
						<TextField
							type="number"
							label="Decimals"
							style={styles.numberField}
							defaultValue={fields.current.properties.decimals}
							onChange={e => (fields.current.properties.decimals = e.target.value)}
						/>
						<TextField
							type="number"
							label="Initial supply"
							style={styles.numberField}
							defaultValue={fields.current.properties.initialSupply}
							onChange={e => (fields.current.properties.initialSupply = e.target.value)}
						/>
					</div>
					<StepsBottomNav nav={props.nav} handleNext={submit} />
				</>
			)}
		</>
	);
}

const styles = {
	numberField: {
		marginBottom: '15px'
	}
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(StepTraits, mapStateToProps);
