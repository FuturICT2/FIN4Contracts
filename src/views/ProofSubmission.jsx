import React, { Component } from 'react';
import Container from '../Styles';

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
			</Container>
		)
	}
}

export default ProofSubmission;
