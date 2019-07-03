import React, { Component } from 'react';
import ContractData from '../ContractData';
import { Fin4Box } from '../Elements';

class Messages extends Component {
	getMyMessage = ({ 0: sender, 1: message, 2: fulfillmentAddress, 3: proofTypeName }) => {
		return (
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
			messageIndices.length > 0 && (
				<Fin4Box title="Messages">
					{messageIndices.map(index => {
						return (
							<ContractData
								key={index}
								contractName="Fin4Main"
								method="getMyMessage"
								methodArgs={[index]}
								callback={this.getMyMessage}
							/>
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
