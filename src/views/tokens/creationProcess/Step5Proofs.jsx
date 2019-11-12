import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';
import Dropdown from '../../../components/Dropdown';
import Button from '../../../components/Button';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

function StepProofs(props) {
	const { t } = useTranslation();

	const [draftId, setDraftId] = useState(null);

	const fields = useRef({});

	useEffect(() => {
		if (!props.draft || draftId) {
			return;
		}
		let draft = props.draft;
		fields.current = {
			proofs: [] // TODO get from draft
		};
		setDraftId(draft.id);
	});

	const submit = () => {
		fields.current.lastModified = moment().valueOf();

		props.handleNext();
	};

	const [showDropdown, setShowDropdown] = useState(false);
	const [proofsAdded, setProofsAdded] = useState([]);

	const addProof = addr => {
		fields.current.proofs.push(addr);
		setProofsAdded(proofsAdded.concat(addr));
		setShowDropdown(false);
	};

	const removeProof = addr => {
		setProofsAdded(proofsAdded.filter(a => a !== addr));
		fields.current.proofs.splice(getIndexInProofsAdded(addr), 1);
	};

	const getIndexInProofsAdded = addr => {
		for (let i = 0; i < proofsAdded.length; i++) {
			if (proofsAdded[i] === addr) {
				return i;
			}
		}
		return -1;
	};

	return (
		<>
			{draftId && (
				<>
					{proofsAdded.length > 0 && (
						<div style={{ fontFamily: 'arial', padding: '20px 0 10px 0' }}>
							{proofsAdded.map((addr, index) => {
								let proofType = props.proofTypes[addr];
								return (
									<div
										key={'proof_' + index}
										title={proofType.description}
										style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px' }}>
										<ArrowRightIcon />
										{proofType.label}
										<FontAwesomeIcon icon={faMinusCircle} style={styles.removeIcon} onClick={() => removeProof(addr)} />
									</div>
								);
							})}
						</div>
					)}
					{showDropdown ? (
						<Dropdown
							onChange={e => addProof(e.value)}
							options={Object.keys(props.proofTypes)
								.filter(addr => getIndexInProofsAdded(addr) === -1)
								.map(addr => props.proofTypes[addr])}
							label="Add proof type"
						/>
					) : (
						<Button onClick={() => setShowDropdown(true)} center="true" color="inherit">
							Add
						</Button>
					)}
					<StepsBottomNav nav={props.nav} handleNext={submit} />
				</>
			)}
		</>
	);
}

const styles = {
	removeIcon: {
		color: 'lightsalmon',
		width: '14px',
		height: '14px',
		paddingLeft: '7px'
	}
};

const mapStateToProps = state => {
	return {
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(StepProofs, mapStateToProps);
