import React, { Component } from 'react';
import Container from '../Styles';
import ContractData from '../ContractData';

const requiredProofTypeAddresses = data => {
    var tokenName = data[0];
    var tokenSymbol = data[1];
    var claimer = data[2];
    var isApproved = data[3];
    var quantity = Number(data[4]);
    var date = Number(data[5]);
    var comment = data[6];
    var requiredProofTypes = data[7];
    var proofTypeStatuses = data[8];

	return "";
}

class ProofSubmission extends Component {
	constructor(props, context) {
		super(props);
        this.state = {};

        // TODO make this parsing more robust with errors if wrong etc.
        var url = window.location.href;
        var params = url.split('?')[1].split('&');
        this.tokenAddress = params[0].split('=')[1];
        this.claimId = Number(params[1].split('=')[1]);
    }

	render() {
		return (
			<Container>
                {this.tokenAddress} {this.claimId}
                <ContractData
                    contractAddress={this.tokenAddress}
                    method="getClaim"
                    methodArgs={[this.claimId]}
					callback={requiredProofTypeAddresses}
				/>
			</Container>
		)
	}
}

export default ProofSubmission;
