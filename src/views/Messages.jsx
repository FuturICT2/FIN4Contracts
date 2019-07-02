import React, { Component } from 'react';
import { Box } from '../Elements';
import ContractData from '../ContractData';

class Messages extends Component {
	getMyMessage = ({ 0: sender, 1: message }) => {
		return (
			<li>
				{message} <i>{sender}</i>
			</li>
		);
	};

	getMyMessagesCount = data => {
		var messageCount = Number(data);
		if (messageCount === 0) {
			return <i>No messages</i>;
		}
		var messageIndices = [];
		for (var i = 0; i < messageCount; i++) {
			messageIndices.push(i);
		}
		const messageItems = messageIndices.map(index => {
			return (
				<ContractData
					key={index}
					contractName="Fin4Main"
					method="getMyMessage"
					methodArgs={[index]}
					callback={this.getMyMessage}
				/>
			);
		});
		return <ul>{messageItems}</ul>;
	};

	render() {
		return (
			<Box title="Messages">
				<ContractData contractName="Fin4Main" method="getMyMessagesCount" callback={this.getMyMessagesCount} />
			</Box>
		);
	}
}

export default Messages;
