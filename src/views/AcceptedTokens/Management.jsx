import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import Button from '../../components/Button';
import { RepTokenAddress, GOVTokenAddress } from '../../config/DeployedAddresses.js';
import { getContractData, getContract } from '../../components/Contractor';
import Modal from '../../components/Modal';
import ContractForm from '../../components/ContractForm';
const BN = require('bignumber.js');

class Management extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isDelegateModalOpen: false,
			isRefundDelegationModalOpen: false,
			repTokenBalance: '?',
			govTokenBalance: '?',
			govTokenDelegateeBalance: '?'
		};

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
	}

	claimGOV() {
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
	}

	toggleDelegateModal = () => {
		this.setState({ isDelegateModalOpen: !this.state.isDelegateModalOpen });
	};

	toggleRefundDelegationModal = () => {
		this.setState({ isRefundDelegationModalOpen: !this.state.isRefundDelegationModalOpen });
	};

	render() {
		return (
			<center>
				<Box title="Token Balances" width="600px">
					<Table headers={['Token', 'Balance', 'Actions']}>
						<TableRow
							key="rep-token"
							data={{
								token: 'Reputation Token',
								balance: this.state.repTokenBalance,
								actions: <Button onClick={this.claimGOV}>Claim GOV</Button>
							}}
						/>
						<TableRow
							key="gov-token"
							data={{
								token: 'Governance Token',
								balance: this.state.govTokenBalance,
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
								amount: this.state.govTokenDelegateeBalance
							}}
						/>
					</Table>
					<Button onClick={this.toggleDelegateModal} center="true">
						Delegate
					</Button>
					<Button onClick={this.toggleRefundDelegationModal} center="true">
						Refund delegation
					</Button>
					<Modal
						isOpen={this.state.isDelegateModalOpen}
						handleClose={this.toggleDelegateModal}
						title="Delegate GOV tokens"
						width="400px">
						<ContractForm
							contractAddress={GOVTokenAddress}
							contractName="GOV"
							method="delegate"
							labels={['Delegator address', 'Amount']}
							postSubmitCallback={(success, result) => {
								if (!success) {
									alert(result.message);
								}
								this.toggleDelegateModal();
							}}
						/>
					</Modal>
					<Modal
						isOpen={this.state.isRefundDelegationModalOpen}
						handleClose={this.toggleRefundDelegationModal}
						title="Refund delegated GOV tokens"
						width="400px">
						<ContractForm
							contractAddress={GOVTokenAddress}
							contractName="GOV"
							method="refundDelegation"
							labels={['Delegator address', 'Amount']}
							postSubmitCallback={(success, result) => {
								if (!success) {
									alert(result.message);
								}
								this.toggleRefundDelegationModal();
							}}
						/>
					</Modal>
				</Box>
			</center>
		);
	}
}

export default drizzleConnect(Management);
