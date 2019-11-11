import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';
import { Checkbox, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../../components/Modal';

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

	const [isModalOpen, setModalOpen] = useState(false);
	const toggleModal = () => {
		setModalOpen(!isModalOpen);
	};
	const modalText = useRef('');

	const buildCheckboxWithInfo = (label, infoText) => {
		return (
			<>
				<FormControlLabel
					control={<Checkbox checked={true} onChange={() => {}} />}
					label={label}
					style={{ marginRight: '6px' }}
				/>
				<FontAwesomeIcon
					icon={faInfoCircle}
					style={styles.infoIcon}
					onClick={() => {
						modalText.current = infoText;
						toggleModal();
					}}
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
						<div style={{ fontFamily: 'arial' }}>{modalText.current}</div>
					</Modal>
					{/* TODO: decimals, cap, initial supply */}
					{buildCheckboxWithInfo('is burnable', 'TODO')}
					{buildCheckboxWithInfo('is transferable', 'TODO')}
					{buildCheckboxWithInfo('is mintable', 'TODO')}
					<StepsBottomNav nav={props.nav} handleNext={submit} />
				</>
			)}
		</>
	);
}

const styles = {
	infoIcon: {
		color: 'silver',
		width: '16px',
		height: '16px'
	}
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(StepTraits, mapStateToProps);
