import React, { Component } from 'react';
import { Fin4Box } from '../Elements';
import ContractData from '../ContractData';

class Messages extends Component {
	getMyMessage = ({ 0: sender, 1: message }) => {
		return (
			<p>
				{message} <i>{sender}</i>
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
			<Fin4Box>
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
		);
	};

	render() {
		return <ContractData contractName="Fin4Main" method="getMyMessagesCount" callback={this.getMyMessagesCount} />;
	}
}

export default Messages;
