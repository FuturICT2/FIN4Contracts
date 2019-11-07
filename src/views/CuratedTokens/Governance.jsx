import React, { useState, useRef, useEffect } from 'react';
import { getContractData, getPollStatus, PollStatus, fetchParameterizerParams } from '../../components/Contractor';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { TextField } from '@material-ui/core';
import VoteModal from './VoteModal';
import RevealModal from './RevealModal';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
const BN = require('bignumber.js');

function Governance(props, context) {
	const { t } = useTranslation();

	const [isProposeReparamOpen, setProposeReparamOpen] = useState(false);
	const [isChallengeReparamOpen, setChallengeReparamOpen] = useState(false);
	const [isVoteModalOpen, setVoteModalOpen] = useState(false);
	const [isRevealModalOpen, setRevealModalOpen] = useState(false);

	const [params, setParams] = useState({});

	const selectedParamName = useRef(null);
	const proposeReparamModalValue = useRef(null);

	const paramsAugmented = useRef(false);
	const paramStatusesFetched = useRef(false);

	useEffect(() => {
		fetchParameterizerParams(props.contracts, props, context.drizzle);

		if (!paramsAugmented.current && Object.keys(props.parameterizerParams).length > 0) {
			paramsAugmented.current = true;
			augmentParams();
		}

		if (!paramStatusesFetched.current && Object.keys(params).length > 0) {
			paramStatusesFetched.current = true;
			fetchParamStatuses();
		}
	});

	const augmentParams = () => {
		let paramsObj = {};
		for (var paramName in props.parameterizerParams) {
			if (props.parameterizerParams.hasOwnProperty(paramName)) {
				paramsObj[paramName] = {
					name: paramName,
					statusEnum: ParamActionStatus.DEFAULT,
					status: '-',
					dueDate: '-',
					propId: null,
					propDeposit: null,
					dueDate: null,
					challengeID: null
				};
			}
		}
		setParams(paramsObj);
	};

	const fetchParamStatuses = () => {
		// get proposals

		let parameterizerContract = context.drizzle.contracts.Parameterizer;

		getContractData(parameterizerContract, props.defaultAccount, 'getProposalKeys').then(proposalKeys => {
			let paramsWithProposal = [];
			let allPromises = proposalKeys.map(key => {
				return getContractData(parameterizerContract, props.defaultAccount, 'proposals', key).then(
					({ 0: appExpiryBN, 1: challengeIDBN, 2: depositBN, 3: name, 4: owner, 5: processByBN, 6: valueBN }) => {
						let param = params[name];
						paramsWithProposal.push(param);
						param.propID = key;
						param.propDeposit = new BN(depositBN).toNumber();

						let appExpiry = new BN(appExpiryBN).toNumber() * 1000;
						param.dueDate = new Date(appExpiry).toLocaleString('de-CH-1996');

						let nowTimestamp = Date.now();
						let inAppTime = appExpiry - nowTimestamp > 0;
						let value = new BN(valueBN).toNumber();

						let challengeID = new BN(challengeIDBN).toNumber();
						param.challengeID = challengeID;

						if (challengeID === 0) {
							if (inAppTime) {
								param.statusEnum = ParamActionStatus.PROPOSEDREPARAM;
								param.status = 'Proposed value: ' + value;
								return;
							}
							param.statusEnum = ParamActionStatus.DEFAULT;
							param.status = '-';
							param.dueDate = '-';
						}

						return getPollStatus(challengeID, context.drizzle.contracts.PLCRVoting, props.defaultAccount).then(
							pollStatus => {
								param.dueDate = pollStatus.dueDate;
								switch (pollStatus.inPeriod) {
									case PollStatus.IN_COMMIT_PERIOD:
										param.statusEnum = ParamActionStatus.VOTE;
										param.status = ParamActionStatus.VOTE;
										return;
									case PollStatus.IN_REVEAL_PERIOD:
										param.statusEnum = ParamActionStatus.REVEAL;
										param.status = ParamActionStatus.REVEAL;
										return;
									case PollStatus.PAST_REVEAL_PERIOD:
										return getContractData(parameterizerContract, props.defaultAccount, 'challenges', challengeID).then(
											({
												0: rewardPoolBN,
												1: challenger,
												2: resolved,
												3: stakeBN,
												4: winningTokensBN,
												5: tokenClaimsMapping
											}) => {
												if (resolved) {
													param.statusEnum = ParamActionStatus.DEFAULT;
													param.status = '-';
													param.dueDate = '-';
													return;
												}
												param.statusEnum = ParamActionStatus.UPDATE;
												param.status = 'Update pending';
												param.dueDate = '-';
											}
										);
								}
							}
						);
					}
				);
			});
			Promise.all(allPromises).then(() => {
				for (let i = 0; i < paramsWithProposal.length; i++) {
					setParams(
						update(params, {
							[paramsWithProposal[i].name]: { $set: paramsWithProposal[i] }
						})
					);
				}
			});
		});
	};

	// ---------- ProposeReparam ----------

	const resetproposeReparamModalValue = () => {
		proposeReparamModalValue.current = null;
	};

	const toggleProposeReparamModal = () => {
		if (isProposeReparamOpen) {
			resetproposeReparamModalValue();
		}
		setProposeReparamOpen(!isProposeReparamOpen);
	};

	const submitProposeReparamModal = () => {
		let name = selectedParamName.current;
		let value = Number(proposeReparamModalValue.current);
		let pMinDeposit = props.parameterizerParams['pMinDeposit'].value;
		let parameterizerContract = context.drizzle.contracts.Parameterizer;

		toggleProposeReparamModal();

		context.drizzle.contracts.GOV.methods
			.approve(parameterizerContract.address, pMinDeposit)
			.send({ from: props.defaultAccount })
			.then(result => {
				console.log('Results of submitting GOV.approve: ', result);

				parameterizerContract.methods
					.proposeReparameterization(name, value)
					.send({ from: props.defaultAccount })
					.then(result => {
						console.log('Results of submitting Parameterizer.proposeReparameterization: ', result);
					});
			});
	};
	// ---------- VoteModal ----------

	const toggleVoteModal = () => {
		setVoteModalOpen(!isVoteModalOpen);
	};

	// ---------- RevealModal ----------

	const toggleRevealModal = () => {
		setRevealModalOpen(!isRevealModalOpen);
	};

	// ---------- ChallengeReparam ----------

	const toggleChallengeReparamModal = () => {
		setChallengeReparamOpen(!isChallengeReparamOpen);
	};

	const submitChallengeReparamModal = () => {
		let propID = params[selectedParamName.current].propID;
		let propDeposit = params[selectedParamName.current].propDeposit;
		let parameterizerContract = context.drizzle.contracts.Parameterizer;

		toggleChallengeReparamModal();

		context.drizzle.contracts.GOV.methods
			.approve(parameterizerContract.address, propDeposit)
			.send({ from: props.defaultAccount })
			.then(result => {
				console.log('Results of submitting GOV.approve: ', result);

				parameterizerContract.methods
					.challengeReparameterization(propID)
					.send({ from: props.defaultAccount })
					.then(result => {
						console.log('Results of submitting Parameterizer.challengeReparameterization: ', result);
					});
			});
	};

	// ----------

	// same as Registry.updateStatus()
	const processProposal = () => {
		let propID = params[selectedParamName.current].propID;

		context.drizzle.contracts.Parameterizer.methods
			.processProposal(propID)
			.send({ from: props.defaultAccount })
			.then(result => {
				console.log('Results of submitting Parameterizer.processProposal: ', result);
			});
	};

	return (
		<center>
			<Box title="TCR Parameters" width="900px">
				<Table headers={['Parameter', 'Description', 'Value', 'Actions', 'Status', 'Due Date']}>
					{Object.keys(params).map((paramName, index) => {
						let entry = params[paramName];
						let paramInStore = props.parameterizerParams[paramName];
						return (
							<TableRow
								key={index}
								data={{
									parameter: paramName,
									description: paramInStore.description,
									value: paramInStore.value,
									actions: (
										<Button
											onClick={() => {
												selectedParamName.current = paramName;
												switch (entry.statusEnum) {
													case ParamActionStatus.DEFAULT:
														toggleProposeReparamModal();
														break;
													case ParamActionStatus.PROPOSEDREPARAM:
														toggleChallengeReparamModal();
														break;
													case ParamActionStatus.VOTE:
														toggleVoteModal();
														break;
													case ParamActionStatus.REVEAL:
														toggleRevealModal();
														break;
													case ParamActionStatus.UPDATE:
														processProposal();
														break;
												}
											}}>
											{entry.statusEnum}
										</Button>
									),
									status: entry.status,
									dueDate: entry.dueDate
								}}
							/>
						);
					})}
				</Table>
			</Box>
			<Modal
				isOpen={isProposeReparamOpen}
				handleClose={toggleProposeReparamModal}
				title="Propose new value"
				width="400px">
				<TextField
					key="propose-value"
					type="number"
					label="Value"
					onChange={e => (proposeReparamModalValue.current = e.target.value)}
					style={inputFieldStyle}
				/>
				<Button onClick={submitProposeReparamModal} center="true">
					Submit
				</Button>
				<center>
					<small style={{ fontFamily: 'arial', color: 'gray' }}>
						Upon submitting, two transactions have to be signed: to allow the deposit (
						{props.parameterizerParams['pMinDeposit'] ? props.parameterizerParams['pMinDeposit'].value : '?'}) to be
						withdrawn from your GOV token balance and then to submit the proposed reparameterization.
					</small>
				</center>
			</Modal>
			<Modal
				isOpen={isChallengeReparamOpen}
				handleClose={toggleChallengeReparamModal}
				title="Challenge proposed value"
				width="400px">
				<Button onClick={submitChallengeReparamModal} center="true">
					Submit
				</Button>
				<center>
					<small style={{ fontFamily: 'arial', color: 'gray' }}>
						Upon submitting, two transactions have to be signed: to allow the proposal-deposit (
						{selectedParam.current ? selectedParam.current.propDeposit : '?'}) to be withdrawn from your GOV token
						balance and then to challenge the proposed reparameterization.
					</small>
				</center>
			</Modal>
			<VoteModal
				isOpen={isVoteModalOpen}
				handleClose={toggleVoteModal}
				pollID={selectedParam.current && selectedParam.current.challengeID}
				voteOptionsInfo={
					'Challenge: 1 = vote for the proposed new value, 0 = reject the proposed value and keep the existing one'
				}
			/>
			<RevealModal
				isOpen={isRevealModalOpen}
				handleClose={toggleRevealModal}
				pollID={selectedParam.current && selectedParam.current.challengeID}
			/>
		</center>
	);
}

const ParamActionStatus = {
	DEFAULT: 'Propose',
	PROPOSEDREPARAM: 'Challenge',
	VOTE: 'Vote',
	REVEAL: 'Reveal',
	UPDATE: 'Update'
};

const inputFieldStyle = {
	// copied from ContractForm
	width: '100%',
	marginBottom: '15px'
};

Governance.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		defaultAccount: state.fin4Store.defaultAccount,
		parameterizerParams: state.fin4Store.parameterizerParams
	};
};

export default drizzleConnect(Governance, mapStateToProps);
