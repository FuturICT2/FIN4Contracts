import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
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

	const buildCheckboxWithInfo = label => {
		return (
			<>
				<FormControlLabel
					control={<Checkbox checked={true} onChange={() => {}} />}
					label={label}
					style={{ marginRight: '6px' }}
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
						<div style={{ fontFamily: 'arial' }}>TODO</div>
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
						{buildCheckboxWithInfo('is burnable')}
						{buildCheckboxWithInfo('is transferable')}
						{buildCheckboxWithInfo('is mintable')}
						<TextField type="number" label="Decimals" style={styles.numberField} />
						<TextField type="number" label="Cap" style={styles.numberField} />
						<TextField type="number" label="Initial supply" style={styles.numberField} />
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
