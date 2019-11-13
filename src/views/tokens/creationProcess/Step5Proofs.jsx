import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import StepsBottomNav from './StepsBottomNav';
import Dropdown from '../../../components/Dropdown';
import Button from '../../../components/Button';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';

function StepProofs(props) {
	const { t } = useTranslation();

	const [draftId, setDraftId] = useState(null);
	const proofs = useRef({});

	useEffect(() => {
		if (!props.draft || draftId) {
			return;
		}
		let draft = props.draft;
		proofs.current = draft.proofs;
		setProofsAdded(Object.keys(draft.proofs));
		setDraftId(draft.id);
	});

	const submit = () => {
		props.dispatch({
			type: 'UPDATE_TOKEN_CREATION_DRAFT_FIELDS',
			draftId: draftId,
			lastModified: moment().valueOf(),
			nodeName: 'proofs',
			node: proofs.current
		});
		props.handleNext();
	};

	const [showDropdown, setShowDropdown] = useState(false);
	const [proofsAdded, setProofsAdded] = useState([]);

	const addProof = addr => {
		let proofType = props.proofTypes[addr];

		proofs.current[addr] = {
			address: addr,
			name: proofType.label,
			parameters: {}
		};

		if (proofType.paramsEncoded) {
			proofType.paramsEncoded.split(',').map(paramStr => {
				let paramName = paramStr.split(':')[1];
				proofs.current[addr].parameters[paramName] = null;
			});
		}

		setProofsAdded(proofsAdded.concat(addr));
		setShowDropdown(false);
	};

	const removeProof = addr => {
		setProofsAdded(proofsAdded.filter(a => a !== addr));
		delete proofs.current[addr];
	};

	return (
		<>
			{draftId && (
				<>
					{proofsAdded.length > 0 && (
						<div style={{ fontFamily: 'arial' }}>
							{proofsAdded.map((proofAddress, index) => {
								let proofType = props.proofTypes[proofAddress];
								return (
									<div key={'proof_' + index} style={{ padding: '20px 0 0 0' }}>
										<div
											key={'proofLabel_' + index}
											title={proofType.description}
											style={{ display: 'flex', alignItems: 'center' }}>
											<ArrowRightIcon />
											{proofType.label}
											<FontAwesomeIcon
												icon={faMinusCircle}
												style={styles.removeIcon}
												onClick={() => removeProof(proofAddress)}
											/>
										</div>
										{proofType.paramsEncoded &&
											proofType.paramsEncoded.split(',').map((paramStr, paramIndex) => {
												// e.g. uint:interval:days,uint:maxQuantity:quantity
												let type = paramStr.split(':')[0];
												let paramName = paramStr.split(':')[1];
												let description = paramStr.split(':')[2];
												return (
													<TextField
														key={'proof_' + index + '_param_' + paramIndex}
														type={type === 'uint' ? 'number' : 'text'}
														label={
															<>
																<span>{paramName}</span>
																<small> ({description})</small>
															</>
														}
														defaultValue={proofs.current[proofAddress][paramName]}
														onChange={e => (proofs.current[proofAddress][paramName] = e.target.value)}
														style={inputFieldStyle}
													/>
												);
											})}
									</div>
								);
							})}
						</div>
					)}
					{proofsAdded.length > 0 && <Spacer />}
					{showDropdown ? (
						<Dropdown
							onChange={e => addProof(e.value)}
							options={Object.keys(props.proofTypes)
								.filter(addr => !proofs.current[addr])
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

const inputFieldStyle = {
	width: '80%',
	marginLeft: '25px'
};

const Spacer = styled.div`
	height: 30px;
`;

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
