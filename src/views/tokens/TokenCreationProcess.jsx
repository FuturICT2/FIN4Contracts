import React, { useEffect, useState, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Box from '../../components/Box';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import StepBasics from './creationProcess/Step1Basics';
import StepTraits from './creationProcess/Step2Traits';
import StepActions from './creationProcess/Step3Actions';
import StepValue from './creationProcess/Step4Value';
import StepProofs from './creationProcess/Step5Proofs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { steps, getStepContent, getStepInfoBoxContent } from './creationProcess/TextContents';
import { findProofTypeAddressByName } from '../../components/utils';
import { findTokenBySymbol } from '../../components/Contractor';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { IconButton } from '@material-ui/core';
import history from '../../components/history';

const useStyles = makeStyles(theme => ({
	// from https://material-ui.com/components/steppers/
	root: {
		width: '100%'
	},
	backButton: {
		marginRight: theme.spacing(1)
	},
	instructions: {
		fontSize: 'large',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1)
	}
}));

function TokenCreationProcess(props, context) {
	const { t } = useTranslation();
	const classes = useStyles();

	const [draftId, setDraftId] = useState(null);

	useEffect(() => {
		let draftIdViaURL = props.match.params.draftId;
		if (draftId || !draftIdViaURL || !props.tokenCreationDrafts[draftIdViaURL]) {
			return;
		}
		setDraftId(draftIdViaURL);
	});

	const [activeStep, setActiveStep] = useState(0);

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	const buildStepComponent = component => {
		return React.createElement(component, {
			draft: props.tokenCreationDrafts[draftId],
			nav: [activeStep, steps.length, classes, handleBack],
			handleNext: handleNext
		});
	};

	const [showInfoBox, setShowInfoBox] = useState(false);

	const validateDraft = draft => {
		// TODO do a proper validation with warning-signs in the respective steps

		if (draft.basics.name.trim().length === 0) {
			// check for letters only too?
			return "Name can't be empty";
		}

		if (draft.basics.symbol.length < 3 || draft.basics.symbol.length > 5) {
			return 'Symbol must have between 3 and 5 characters';
		}

		if (findTokenBySymbol(props, draft.basics.symbol) !== null) {
			return 'Symbol is already in use';
		}

		if (draft.proofs.Location) {
			let latLonStr = draft.proofs.Location.parameters['latitude / longitude'];
			if (latLonStr.split('/').length !== 2) {
				// also check for other possibly wrong cases?
				return "The 'latitude / longitude' field of the location proof must use '/' as separator";
			}
		}

		return '';
	};

	const createToken = () => {
		let draft = props.tokenCreationDrafts[draftId];

		let validationResult = validateDraft(draft);
		if (validationResult) {
			alert(validationResult);
			return;
		}

		let tokenCreationArgs = [
			draft.basics.name,
			draft.basics.symbol,
			draft.basics.description,
			[
				draft.properties.isTransferable,
				draft.properties.isMintable,
				draft.properties.isBurnable,
				draft.properties.isCapped
			],
			[
				draft.properties.cap,
				draft.properties.decimals,
				draft.properties.initialSupply,
				draft.value.fixedQuantity,
				draft.value.userDefinedQuantityFactor
			],
			draft.actions.text,
			Object.keys(draft.proofs).map(name => findProofTypeAddressByName(props.proofTypes, name))
		];

		context.drizzle.contracts.Fin4TokenManagement.methods
			.createNewToken(...tokenCreationArgs)
			.send({
				from: props.defaultAccount
			})
			.then(result => {
				console.log('Results of submitting Fin4TokenManagement.createNewToken: ', result);
				let newTokenAddress = result.events.Fin4TokenCreated.returnValues.addr;

				for (var name in draft.proofs) {
					if (draft.proofs.hasOwnProperty(name)) {
						let proof = draft.proofs[name];
						let parameterNames = Object.keys(proof.parameters);
						if (parameterNames.length === 0) {
							continue;
						}
						let values = parameterNames.map(parampName => proof.parameters[parampName]);
						// TODO is the correct order of values guaranteed?
						setParamsOnProofContract(name, newTokenAddress, values);
					}
				}

				if (countProofsWithParams() === 0) {
					setTokenJustCreated(true);
				}
			});
	};

	// TODO combine these two with one useState-counter?
	// Tried to do that but couldn't figure it out in reasonable time for some reason
	const transactionCounter = useRef(0);
	const [tokenJustCreated, setTokenJustCreated] = useState(false);

	const setParamsOnProofContract = (contractName, tokenAddr, values) => {
		context.drizzle.contracts[contractName].methods
			.setParameters(tokenAddr, ...values)
			.send({
				from: props.defaultAccount
			})
			.then(result => {
				console.log('Results of submitting ' + contractName + '.setParameters: ', result);
				transactionCounter.current++;
				if (transactionCounter.current == countProofsWithParams()) {
					setTokenJustCreated(true);
				}
			});
	};

	const countProofsWithParams = () => {
		let draft = props.tokenCreationDrafts[draftId];
		return Object.keys(draft.proofs).filter(name => Object.keys(draft.proofs[name].parameters).length > 0).length;
	};

	return (
		<>
			{draftId ? (
				<Container>
					<Box title="Token creation">
						<div className={classes.root}>
							<Stepper activeStep={activeStep} alternativeLabel>
								{steps.map(label => (
									<Step key={label}>
										<StepLabel>{label}</StepLabel>
									</Step>
								))}
							</Stepper>
							<center>
								<Typography className={classes.instructions}>
									<b>{getStepContent(activeStep)}</b>
								</Typography>
								{activeStep < steps.length && (
									<FontAwesomeIcon
										icon={faInfoCircle}
										style={styles.infoIcon}
										onClick={() => setShowInfoBox(!showInfoBox)}
									/>
								)}
							</center>
						</div>
						<div style={{ padding: '10px 20px 30px 20px' }}>
							{/* Or create back/next buttons here and pass them down? */}
							{activeStep === 0 && buildStepComponent(StepBasics)}
							{activeStep === 1 && buildStepComponent(StepTraits)}
							{activeStep === 2 && buildStepComponent(StepActions)}
							{activeStep === 3 && buildStepComponent(StepValue)}
							{activeStep === 4 && buildStepComponent(StepProofs)}
							{activeStep === steps.length && !tokenJustCreated && (
								<center>
									<Typography className={classes.instructions}>All steps completed</Typography>
									{countProofsWithParams() > 0 && (
										<small style={{ color: 'gray', fontFamily: 'arial' }}>
											You added {countProofsWithParams()} proofs with parameters. Each requires a separate transaction.
											Plus one for the creation of the token. You will have to confirm all consecutive transactions to
											complete the token creation.
										</small>
									)}
									<div style={{ paddingTop: '20px' }}>
										<Button onClick={handleReset} className={classes.backButton}>
											Restart
										</Button>
										<Button variant="contained" color="primary" onClick={createToken}>
											Create token
										</Button>
									</div>
								</center>
							)}
							{activeStep === steps.length && tokenJustCreated && (
								<center>
									<Typography className={classes.instructions}>Token successfully created!</Typography>
									<br />
									<IconButton
										style={{ color: 'green', transform: 'scale(2.4)' }}
										onClick={() => history.push('/tokens')}>
										<CheckIcon />
									</IconButton>
								</center>
							)}
						</div>
					</Box>
					{showInfoBox && (
						<Box title={steps[activeStep] + ' info'}>
							<div style={{ fontFamily: 'arial' }}>
								<center>
									<small style={{ color: 'gray' }} onClick={() => setShowInfoBox(false)}>
										CLOSE
									</small>
								</center>
								<br />
								{getStepInfoBoxContent(activeStep, props.proofTypes)}
							</div>
						</Box>
					)}
				</Container>
			) : (
				<center style={{ fontFamily: 'arial' }}>
					No token creation draft found with ID {props.match.params.draftId}
				</center>
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

TokenCreationProcess.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		tokenCreationDrafts: state.fin4Store.tokenCreationDrafts,
		proofTypes: state.fin4Store.proofTypes,
		fin4Tokens: state.fin4Store.fin4Tokens,
		defaultAccount: state.fin4Store.defaultAccount
	};
};

export default drizzleConnect(TokenCreationProcess, mapStateToProps);
