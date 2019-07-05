import React, { Component } from 'react';
import ContractData from '../ContractData';
import { Fin4Box } from '../Elements';

class Messages extends Component {
	getMyMessage = ({ 0: messageType, 1: sender, 2: message, 3: fulfillmentAddress, 4: proofTypeName }) => {
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

	getMyMessagesCount = data => {
		var messageCount = Number(data);
		if (messageCount === 0) {
			return <></>;
		}
		var messageIndices = [];
		for (var i = 0; i < messageCount; i++) {
			messageIndices.push(i);
		}
		return (
			messageIndices.length && (
				<Fin4Box title="Messages">
					{messageIndices.map(index => {
						return (
							<div>
								<ContractData
									key={index}
									contractName="Fin4Main"
									method="getMyMessage"
									methodArgs={[index]}
									callback={this.getMyMessage}
								/>
								<hr></hr>
							</div>
						);
					})}
				</Fin4Box>
			)
		);
	};

	render() {
		return <ContractData contractName="Fin4Main" method="getMyMessagesCount" callback={this.getMyMessagesCount} />;
	}
}

export default Messages;
