import React, { useState, useRef, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ContractForm from '../../components/ContractForm';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { fetchUsersREPbalance } from '../../components/Contractor';
const BN = require('bignumber.js');

function Management(props, context) {
	const { t } = useTranslation();

	const [isDelegateModalOpen, setDelegateModalOpen] = useState(false);
	const [isRefundDelegationModalOpen, setRefundDelegationModalOpen] = useState(false);

	const [govTokenDelegateeBalance, setGovTokenDelegateeBalance] = useState(null);

	useEffect(() => {
		fetchUsersREPbalance(props.contracts, props, context.drizzle);
	});

	/*this.state = {
			repTokenBalance: '?',
			govTokenBalance: '?',
			govTokenDelegateeBalance: '?'
		};*/

	/*
		getContractData_deprecated(RepTokenAddress, 'Fin4Reputation', 'balanceOf', [getCurrentAccount()]).then(
			repTokenBalanceBN => {
				this.setState({ repTokenBalance: new BN(repTokenBalanceBN).toNumber() });
			}
		);

		getContractData_deprecated(GOVTokenAddress, 'GOV', 'balanceOf', [getCurrentAccount()]).then(govTokenBalanceBN => {
			this.setState({ govTokenBalance: new BN(govTokenBalanceBN).toNumber() });
		});

		getContractData_deprecated(GOVTokenAddress, 'GOV', 'getAmountsDelegatedToMe').then(govTokenDelegateeBalanceBN => {
			this.setState({ govTokenDelegateeBalance: new BN(govTokenDelegateeBalanceBN).toNumber() });
		});
*/

	const claimGOV = () => {
		/*
		getContract(RepTokenAddress, 'Fin4Reputation')
			.then(function(instance) {
				return instance.getGOVFromReputation(getCurrentAccount(), {
					from: getCurrentAccount()
				});
			})
			.then(function(result) {
				console.log('Fin4Reputation.getGOVFromReputation Result: ', result);
			})
			.catch(function(err) {
				console.log('Fin4Reputation.getGOVFromReputation Error: ', err.message);
				alert(err.message);
			});
*/
	};

	const toggleDelegateModal = () => {
		setDelegateModalOpen(!isDelegateModalOpen);
	};

	const toggleRefundDelegationModal = () => {
		setRefundDelegationModalOpen(!isRefundDelegationModalOpen);
	};

	return (
		<center>
			<Box title="Token Balances" width="600px">
				<Table headers={['Token', 'Balance', 'Actions']}>
					<TableRow
						key="rep-token"
						data={{
							token: 'Reputation Token',
							balance:
								props.contracts.Fin4Reputation &&
								props.contracts.Fin4Reputation.initialized &&
								props.usersBalances[context.drizzle.contracts.Fin4Reputation.address] !== undefined
									? props.usersBalances[context.drizzle.contracts.Fin4Reputation.address]
									: '?',
							actions: <Button onClick={claimGOV}>Claim GOV</Button>
						}}
					/>
					<TableRow
						key="gov-token"
						data={{
							token: 'Governance Token',
							balance:
								props.contracts.GOV &&
								props.contracts.GOV.initialized &&
								props.usersBalances[context.drizzle.contracts.GOV.address] !== undefined
									? props.usersBalances[context.drizzle.contracts.GOV.address]
									: '?',
							actions: ''
						}}
					/>
				</Table>
			</Box>
			<Box title="Delegation" width="600px">
				<Table headers={['Type', 'Amount']}>
					<TableRow
						key="delegatee"
						data={{
							type: 'GOV tokens delegated to me',
							amount: govTokenDelegateeBalance === null ? '?' : govTokenDelegateeBalance
						}}
					/>
				</Table>
				<Button onClick={toggleDelegateModal} center="true">
					Delegate
				</Button>
				<Button onClick={toggleRefundDelegationModal} center="true">
					Refund delegation
				</Button>
				<Modal isOpen={isDelegateModalOpen} handleClose={toggleDelegateModal} title="Delegate GOV tokens" width="400px">
					<ContractForm
						contractName="GOV"
						method="delegate"
						labels={['Delegator address', 'Amount']}
						postSubmitCallback={(success, result) => {
							if (!success) {
								alert(result.message);
							}
							toggleDelegateModal();
						}}
					/>
				</Modal>
				<Modal
					isOpen={isRefundDelegationModalOpen}
					handleClose={toggleRefundDelegationModal}
					title="Refund delegated GOV tokens"
					width="400px">
					<ContractForm
						contractName="GOV"
						method="refundDelegation"
						labels={['Delegator address', 'Amount']}
						postSubmitCallback={(success, result) => {
							if (!success) {
								alert(result.message);
							}
							toggleRefundDelegationModal();
						}}
					/>
				</Modal>
			</Box>
		</center>
	);
}

Management.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		defaultAccount: state.fin4Store.defaultAccount,
		contracts: state.contracts,
		usersBalances: state.fin4Store.usersBalances
	};
};

export default drizzleConnect(Management, mapStateToProps);
