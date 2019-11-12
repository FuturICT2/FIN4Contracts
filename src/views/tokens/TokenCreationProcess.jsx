import React, { useEffect, useState } from 'react';
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

	const steps = ['Basics', 'Traits', 'Actions', 'Value', 'Proofs']; // Disbursement/Valuation instead of Value?

	const getStepContent = stepIndex => {
		switch (stepIndex) {
			case 0:
				return 'Basic infos';
			case 1:
				return 'Fundamental properties';
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
								<FontAwesomeIcon icon={faInfoCircle} style={styles.infoIcon} onClick={() => {}} />
							</center>
						</div>
						<div style={{ padding: '10px 20px 30px 20px' }}>
							{/* Or create back/next buttons here and pass them down? */}
							{activeStep === 0 && buildStepComponent(StepBasics)}
							{activeStep === 1 && buildStepComponent(StepTraits)}
							{activeStep === 2 && buildStepComponent(StepActions)}
							{activeStep === 3 && buildStepComponent(StepValue)}
							{activeStep === 4 && buildStepComponent(StepProofs)}
							{activeStep === steps.length && (
								<span>
									<Typography className={classes.instructions}>All steps completed</Typography>
									<Button onClick={handleReset}>Reset</Button>
								</span>
							)}
						</div>
					</Box>
					{false && (
						<Box title="Info">
							<div style={{ fontFamily: 'arial' }}>'TODO'</div>
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
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenCreationProcess, mapStateToProps);
