import React, { Component } from 'react';
import { RegistryAddress } from '../../config/DeployedAddresses.js';
import { getContractData } from '../../components/Contractor';
import { drizzleConnect } from 'drizzle-react';
const BN = require('bignumber.js');

const paramNames = [
	'minDeposit',
	'pMinDeposit',
	'applyStageLen',
	'pApplyStageLen',
	'commitStageLen',
	'pCommitStageLen',
	'revealStageLen',
	'pRevealStageLen',
	'dispensationPct',
	'pDispensationPct',
	'voteQuorum',
	'pVoteQuorum',
	'exitTimeDelay',
	'exitPeriodLen',
	'reviewTax',
	'pminReputation'
];

class Governance extends Component {
	constructor(props) {
		super(props);

		this.state = {
			parameters: {}
		};

		getContractData(RegistryAddress, 'Registry', 'parameterizer').then(parameterizerAddress => {
			getContractData(parameterizerAddress, 'Parameterizer', 'getAll').then(paramValues => {
				let params = {};
				for (var i = 0; i < paramNames.length; i++) {
					params[paramNames[i]] = new BN(paramValues[i]).toNumber();
				}
				this.setState({ parameters: params });
			});
		});
	}

	render() {
		return <p> Governance component</p>;
	}
}

export default drizzleConnect(Governance);
