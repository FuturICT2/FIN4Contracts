import React from 'react';
import {
	AccountData,
	ContractData,
	ContractForm
} from 'drizzle-react-components';

export default ({ accounts }) => (
	<div className="App">
		<div className="section">
			<h2>Active Account</h2>
			<AccountData accountIndex="0" units="ether" precision="3" />
		</div>

		<hr />

		<div className="section">
			<h2>Submit Claim</h2>
			<ContractForm contract="Fin4BaseToken" method="submitClaim" />
			<p>
				<strong>Claims submitted by you: </strong>
				<ContractData
					contract="Fin4BaseToken"
					method="getMyTotalNumberOfClaims"
				/>
			</p>
		</div>
	</div>
);

// this.contracts.Fin4BaseToken.methods.getDev().call().then(function(result) {})
