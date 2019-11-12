import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';
import { TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../../components/Modal';

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

	const [isModalOpen, setModalOpen] = useState(false);
	const toggleModal = () => {
		setModalOpen(!isModalOpen);
	};

	const submit = () => {
		fields.current.lastModified = moment().valueOf();
		// TODO
		props.handleNext();
	};

	return (
		<>
			{draftId && (
				<>
					<Modal isOpen={isModalOpen} handleClose={toggleModal} title="Info" width="350px">
						TODO
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
					<br />
					<TextField label="" multiline rows="4" fullWidth variant="outlined" onChange={e => {}} />
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
	}
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(StepActions, mapStateToProps);
