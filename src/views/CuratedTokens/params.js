const ParameterizerParams = [
	{
		name: 'minDeposit',
		description: 'minimum deposit for listing to be whitelisted'
	},
	{
		name: 'pMinDeposit',
		description: 'minimum deposit to propose a reparameterization'
	},
	{
		name: 'applyStageLen',
		description: 'period over which applicants wait to be whitelisted'
	},
	{
		name: 'pApplyStageLen',
		description: 'period over which reparmeterization proposals wait to be processed'
	},
	{
		name: 'commitStageLen',
		description: 'length of commit period for voting'
	},
	{
		name: 'pCommitStageLen',
		description: 'length of commit period for voting in parameterizer'
	},
	{
		name: 'revealStageLen',
		description: 'length of reveal period for voting'
	},
	{
		name: 'pRevealStageLen',
		description: 'length of reveal period for voting in parameterizer'
	},
	{
		name: 'dispensationPct',
		description: "percentage of losing party's deposit distributed to winning party"
	},
	{
		name: 'pDispensationPct',
		description: "percentage of losing party's deposit distributed to winning party in parameterizer"
	},
	{
		name: 'reviewVoteQuorum',
		description: 'type of majority out of 100 necessary for candidate review success'
	},
	{
		name: 'challengeVoteQuorum',
		description: 'type of majority out of 100 necessary for candidate challenge success'
	},
	{
		name: 'pVoteQuorum',
		description: 'type of majority out of 100 necessary for proposal success in parameterizer'
	},
	{
		name: 'exitTimeDelay',
		description: 'minimum length of time user has to wait to exit the registry'
	},
	{
		name: 'exitPeriodLen',
		description: 'maximum length of time user can wait to exit the registry'
	},
	{
		name: 'reviewTax',
		description: 'fee for the reviewers'
	},
	{
		name: 'pminReputation',
		description: 'minimum amount of needed reputation for users to be able to participate in governance'
	}
];

export { ParameterizerParams };
