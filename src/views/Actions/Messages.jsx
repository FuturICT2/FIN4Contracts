import React, { Component } from 'react';
import ContractData from '../../components/ContractData';
import Box from '../../components/Box';

class Messages extends Component {
	showMessage = ({ 0: messageType, 1: sender, 2: message, 3: fulfillmentAddress, 4: proofTypeName }) => {
		if (messageType === '1') {
			// INFO
			return <p>{message}</p>;
		}
		return (
			// messageType === 0: APPROVE
			<p>
				{message}
				<br></br>Requested by: <i>{sender}</i>
				<br></br>
				<b>
					<a href={`/approving?fulfillmentAddress=${fulfillmentAddress}&proofTypeName=${proofTypeName}`}>approve</a>
				</b>
			</p>
		);
	};

	showMyMessages = data => {
		var messageCount = Number(data);
		if (messageCount === 0) {
			return <></>;
		}
		var messageIndices = [];
		for (var i = 0; i < messageCount; i++) {
			messageIndices.push(i);
		}
		return (
			messageIndices.length > 0 && (
				<Box title="Messages">
					{messageIndices.map(index => {
						return (
							<div>
								<ContractData
									key={index}
									contractName="Fin4Main"
									method="getMyMessage"
									methodArgs={[index]}
									callback={this.showMessage}
								/>
								<hr></hr>
							</div>
						);
					})}
				</Box>
			)
		);
	};

	render() {
		return <ContractData contractName="Fin4Main" method="getMyMessagesCount" callback={this.showMyMessages} />;
	}
}

export default Messages;
