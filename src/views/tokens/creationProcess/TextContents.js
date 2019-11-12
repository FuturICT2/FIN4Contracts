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

export { steps, getStepContent };
