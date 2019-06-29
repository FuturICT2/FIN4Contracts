import React, { Component } from 'react';
import Container from '../Styles';
import ContractData from '../ContractData';

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

    requiredProofTypeAddresses = data => {
        var tokenName = data[0];
        var tokenSymbol = data[1];
        var claimer = data[2];
        var isApproved = data[3];
        var quantity = Number(data[4]);
        var date = Number(data[5]);
        var comment = data[6];
        var requiredProofTypes = data[7];
        var proofTypeStatuses = data[8];

        const proofTypes = requiredProofTypes.map((address, index) => {
            return (
                <span key={index}><hr></hr>{address}<br></br>{proofTypeStatuses[index] + ""}<br></br><br></br></span>
            );
        });

        return (<div>Claim <i>{this.claimId}</i> on action type <b>{tokenName}</b> [{tokenSymbol}]<br></br><br></br>
        isApproved: <i>{isApproved + ""}</i>, quantity: <i>{quantity}</i>, date: <i>{date}</i>, comment: <i>{comment}</i><br></br><br></br>
        {proofTypes}
        </div>);
    }

	render() {
		return (
			<Container>
                <ContractData
                    contractAddress={this.tokenAddress}
                    method="getClaim"
                    methodArgs={[this.claimId]}
					callback={this.requiredProofTypeAddresses}
				/>
			</Container>
		)
	}
}

export default ProofSubmission;
