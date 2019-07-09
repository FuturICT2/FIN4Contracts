import React, { Component } from 'react';
import ContractData from '../../components/ContractData';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../components/ContractData';

class Messages extends Component {
	constructor(props, context) {
		super(props);

		this.state = {
			messages: []
		};

		getContractData('Fin4Main', 'Fin4Main.json', 'getMyMessagesCount', [], context.drizzle)
			.then(data => {
				var messageCount = Number(data);
				var messageIndices = [];
				for (var i = 0; i < messageCount; i++) {
					messageIndices.push(i);
				}
				return messageIndices.map(index => {
				 return getContractData('Fin4Main', 'Fin4Main.json', 'getMyMessage', [index], context.drizzle)
					.then(({ 0: messageType, 1: sender, 2: message, 3: fulfillmentAddress, 4: proofTypeName }) => {
						return {
							messageType: messageType,
							sender: sender,
							message: message,
							fulfillmentAddress: fulfillmentAddress,
							proofTypeName: proofTypeName
						};
					})
				});
			})
			.then(data => Promise.all(data))
			.then(data => {
				this.setState({ messages: data });
			});
	}

	showMessage = msg => {
		if (msg.messageType === '1') {
			// INFO
			return <p>{msg.message}</p>;
		}
		return (
			// messageType === 0: APPROVE
			<p>
				{msg.message}
				<br></br>Requested by: <i>{msg.sender}</i>
				<br></br>
				<b>
					<a href={`/approving?fulfillmentAddress=${msg.fulfillmentAddress}&proofTypeName=${msg.proofTypeName}`}>approve</a>
				</b>
			</p>
		);
	};

	render() {
		if (this.state.messages.length < 1) {
			return "";
		}
		return (
			<Box title="Messages">
				{this.state.messages.map(message => {
					return (
						<div>
							{this.showMessage(message)}
							<hr></hr>
						</div>
					);
				})}
			</Box>
		)
	}
}

Messages.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(Messages, mapStateToProps);
