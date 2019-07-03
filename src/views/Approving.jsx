import React, { Component } from 'react';
import { Fin4Container, Fin4Box } from '../Elements';
import ContractForm from '../ContractForm';

class Approving extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		var url = window.location.href;

		if (url.split('?').length < 1) {
			return;
		}

		// TODO make error-proof
		var params = url.split('?')[1].split('&');
		this.fulfillmentAddress = params[0].split('=')[1];
		this.proofTypeName = params[1].split('=')[1];
	}

	render() {
		if (this.fulfillmentAddress === undefined) {
			return 'URL must contain parameters for fulfillmentAddress';
		}
		return (
			<Fin4Container>
				<Fin4Box title="Approve">
					<ContractForm
						contractAddress={this.fulfillmentAddress}
						// instead of passing the proofTypeName, make an extra getName() call for that?
						contractJson={this.proofTypeName + '.json'}
						method="receiveApprovalFromSpecificAddress"
					/>
				</Fin4Box>
			</Fin4Container>
		);
	}
}

export default Approving;
