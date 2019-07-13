import React, { Component } from 'react';
import Box from '../../components/Box';
import ContractForm from '../../components/ContractForm';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../components/ContractData';
import { Typography, Divider, Paper } from '@material-ui/core';
import styled from 'styled-components';

class Messages extends Component {
	constructor(props, context) {
		super(props);

		this.state = {
			messages: []
		};

		getContractData('Fin4Main', 'Fin4Main.json', 'getFin4MessagesAddress', [], context.drizzle)
		.then(Fin4MessagesAddress => {
			getContractData(Fin4MessagesAddress, 'Fin4Messages.json', 'getMyMessagesCount', [], context.drizzle)
				.then(data => {
					var messageCount = Number(data);
					var messageIndices = [];
					for (var i = 0; i < messageCount; i++) {
						messageIndices.push(i);
					}
					return messageIndices.map(index => {
						return getContractData(Fin4MessagesAddress, 'Fin4Messages.json', 'getMyMessage', [index], context.drizzle).then(
							({ 0: messageType, 1: sender, 2: message, 3: fulfillmentAddress, 4: proofTypeName }) => {
								return {
									messageType: messageType,
									sender: sender,
									message: message,
									fulfillmentAddress: fulfillmentAddress,
									proofTypeName: proofTypeName
								};
							}
						);
					});
				})
				.then(data => Promise.all(data))
				.then(data => {
					this.setState({ messages: data });
				});
			})
	}

	render() {
		return (
			this.state.messages.length > 0 && (
				<Box title="Messages">
					{this.state.messages.map(msg => {
						return (
							<Message key={`${msg.proofTypeName}${msg.fulfillmentAddress}`}>
								<Typography color="textSecondary" variant="body2">
									{msg.message}.
								</Typography>
								{msg.messageType === '0' && (
									<>
										<Divider style={{ margin: '10px 0' }} variant="middle" />
										<Typography color="textSecondary" variant="body2">
											Requested by {msg.sender}
										</Typography>
										<Divider style={{ margin: '10px 0' }} variant="middle" />
										<ContractForm
											buttonLabel="approve"
											contractAddress={msg.fulfillmentAddress}
											// instead of passing the proofTypeName, make an extra getName() call for that?
											contractJson={`${msg.proofTypeName}.json`}
											method="receiveApprovalFromSpecificAddress"
										/>
									</>
								)}
							</Message>
						);
					})}
				</Box>
			)
		);
	}
}

const Message = styled(Paper)`
	&& {
		box-sizing: border-box;
		margin: 15px 0;
		padding: 15px;
		background: rgba(0, 0, 0, 0.07);
	}
`;

Messages.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(Messages, mapStateToProps);
