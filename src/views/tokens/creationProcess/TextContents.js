import React from 'react';

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

const getStepInfoBoxContent = stepIndex => {
	switch (stepIndex) {
		case 0:
			return <>TODO</>;
		case 1:
			return (
				<>
					<b>is transferable</b>
					<br />
					Users who have a balance on this token, can transfer some or all of it to other users. In most cases users
					want to be able to transfer positive action tokens (e.g. for trading).
					<br />
					<br />
					<b>is mintable</b>
					<br />
					Eligible users or smart contracts can "mint" any amount to a public address of their choosing. The total
					supply of this token gets increased by that amount.
					<br />
					<br />
					<b>is burnable</b>
					<br />
					Users can burn some or all of their balance on this token. The burned amount gets deducted from their balance
					and the total supply of the token shrinks by that amount.
					<br />
					<br />
					<b>is capped</b>
					<br />
					Once the cap is reached, no more minting is possible on this token.
					<br />
					<br />
					<b>Cap</b>
					<br />
					If the above is activated, this is the value of the cap.
					<br />
					<br />
					<b>Decimals</b>
					<br />
					The digits by which your token is divisible. Zero means that users can only have natural numbers as balance on
					your token and only amounts in natural numbers can be transferred.
					<br />
					<br />
					<b>Initial supply</b>
					<br />
					Sets your initial balance on this token. It calls the mint function, so the total supply will also rise to
					this amount.
				</>
			);
		case 2:
			return <>TODO</>;
		case 3:
			return (
				<>
					<b>Fixed</b>
					<br />
					Per successful claim, this amount will be minted to the user.
					<br />
					<br />
					<b>User defined</b>
					<br />
					When claiming your token, users have to fill out a quantity field. Once the claim is successful, the amount
					minted to the user is the self-defined quantity multiplied with the factor set here.
				</>
			);
		case 4:
			return <>TODO</>;
		default:
			return <>TODO</>;
	}
};

export { steps, getStepContent, getStepInfoBoxContent };
