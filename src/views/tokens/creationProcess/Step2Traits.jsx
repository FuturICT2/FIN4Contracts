import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../../components/Modal';

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

	const [isModalOpen, setModalOpen] = useState(false);
	const toggleModal = () => {
		setModalOpen(!isModalOpen);
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
					<Modal isOpen={isModalOpen} handleClose={toggleModal} title="Info" width="350px">
						<div style={{ fontFamily: 'arial' }}>
							<b>is transferable</b>
							<br />
							Users who have a balance on this token, can transfer some or all of it to other users. In most cases users
							want to be able to transfer positive action tokens (e.g. for trading).
							<br />
							<br />
							<b>is mintable</b>
							<br />
							Eligible users or smart contracts can "mint" any amount to a public address of their choosing. The total
							supply of this token gets increased by that amount.
							<br />
							<br />
							<b>is burnable</b>
							<br />
							Users can burn some or all of their balance on this token. The burned amount gets deducted from their
							balance and the total supply of the token shrinks by that amount.
							<br />
							<br />
							<b>is capped</b>
							<br />
							Once the cap is reached, no more minting is possible on this token.
							<br />
							<br />
							<b>Cap</b>
							<br />
							If the above is activated, this is the value of the cap.
							<br />
							<br />
							<b>Decimals</b>
							<br />
							The digits by which your token is divisible. Zero means that users can only have natural numbers as
							balance on your token and only amounts in natural numbers can be transferred.
							<br />
							<br />
							<b>Initial supply</b>
							<br />
							Sets your initial balance on this token. It calls the mint function, so the total supply will also rise to
							this amount.
							<br />
							<br />
						</div>
					</Modal>
					<center>
						<FontAwesomeIcon
							icon={faInfoCircle}
							style={styles.infoIcon}
							onClick={() => {
								toggleModal();
							}}
						/>
					</center>
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
	infoIcon: {
		color: 'silver',
		width: '20px',
		height: '20px'
	},
	numberField: {
		marginBottom: '15px'
	}
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(StepTraits, mapStateToProps);
