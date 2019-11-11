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
import StepBasics from './creationProcess/StepBasics';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
	// from https://material-ui.com/components/steppers/
	root: {
		width: '100%'
	},
	backButton: {
		marginRight: theme.spacing(1)
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1)
	}
}));

function TokenCreationProcess(props, context) {
	const { t } = useTranslation();
	const classes = useStyles();

	const [draft, setDraft] = useState(null);

	useEffect(() => {
		let draftId = props.match.params.draftId;
		if (draft || !draftId || !props.tokenCreationDrafts[draftId]) {
			return;
		}
		setDraft(props.tokenCreationDrafts[draftId]);
	});

	const steps = ['Basics', 'Traits', 'Actions', 'Value', 'Proofs']; // Disbursement/Valuation instead of Value?

	const getStepContent = stepIndex => {
		switch (stepIndex) {
			case 0:
				return 'Basic infos';
			case 1:
				return 'Fundamental properties of the token';
			case 2:
				return 'For what action(s) can people claim this token?';
			case 3:
				return 'What quantity can be obtained per claim?';
			case 4:
				return 'Add proof types that users will have to provide';
			default:
				return '';
		}
	};

	const [activeStep, setActiveStep] = useState(0);

	const submitCallbacks = useRef({});

	// step components register their submit callback here via their useEffect() methods
	// can be called multiple times, this method shields against that
	const addSubmitCallback = (stepName, submitCallback) => {
		if (!submitCallbacks.current[stepName]) {
			submitCallbacks.current[stepName] = submitCallback;
		}
	};

	const handleNext = () => {
		submitCallbacks.current[steps[activeStep]]();
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<>
			{draft ? (
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
								<Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
							</center>
						</div>

						<center style={{ padding: '10px 20px 30px 20px' }}>
							{activeStep === 0 && <StepBasics draft={draft} addSubmitCallback={addSubmitCallback} />}
							{activeStep === 1 && <>Traits</>}
							{activeStep === 2 && <>Actions</>}
							{activeStep === 3 && <>Value</>}
							{activeStep === 4 && <>Proofs</>}
						</center>

						<div>
							<center style={{ paddingBottom: '20px' }}>
								{activeStep === steps.length ? (
									<span>
										<Typography className={classes.instructions}>All steps completed</Typography>
										<Button onClick={handleReset}>Reset</Button>
									</span>
								) : (
									<div>
										<Button disabled={activeStep === 0} onClick={handleBack} className={classes.backButton}>
											Back
										</Button>
										<Button variant="contained" color="primary" onClick={handleNext}>
											{activeStep === steps.length - 1 ? 'Finish' : 'Next'}
										</Button>
									</div>
								)}
							</center>
						</div>
					</Box>
				</Container>
			) : (
				<center style={{ fontFamily: 'arial' }}>
					No token creation draft found with ID {props.match.params.draftId}
				</center>
			)}
		</>
	);
}

TokenCreationProcess.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		tokenCreationDrafts: state.fin4Store.tokenCreationDrafts,
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenCreationProcess, mapStateToProps);
