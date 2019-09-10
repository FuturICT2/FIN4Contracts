import React, { Component } from 'react';
import { PLCRVotingAddress } from '../../config/DeployedAddresses.js';
import Modal from '../../components/Modal';
import { drizzleConnect } from 'drizzle-react';
import ContractForm from '../../components/ContractForm';

class RevealModal extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<center>
				<Modal isOpen={this.props.isOpen} handleClose={this.props.handleClose} title="Set vote and salt" width="400px">
					<ContractForm
						contractAddress={PLCRVotingAddress}
						contractName="PLCRVoting"
						method="revealVote"
						labels={['_pollID', 'Vote', 'Salt']}
						staticArgs={{
							_pollID: this.props.listing ? this.props.listing.challengeID : null
						}}
						postSubmitCallback={(success, result) => {
							if (!success) {
								alert(result.message);
							}
							this.props.handleClose();
						}}
					/>
				</Modal>
			</center>
		);
	}
}

export default drizzleConnect(RevealModal);
