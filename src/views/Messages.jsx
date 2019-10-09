import React, { useState, useEffect, useRef } from 'react';
import Box from '../components/Box';
import ContractForm from '../components/ContractForm';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../components/Contractor';
import Button from '../components/Button';
import Photo from '@material-ui/icons/Photo';
import { Typography, Divider, Paper } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

function Messages(props, context) {
	const { t } = useTranslation();

	const [messages, setMessages] = useState([]);
	const messagesFetched = useRef(false);

	useEffect(() => {
		if (props.defaultAccount === null || !props.contracts.Fin4Messages || !props.contracts.Fin4Messages.initialized) {
			return;
		}
		if (!messagesFetched.current) {
			fetchMessages();
		}
	});

	const fetchMessages = () => {
		messagesFetched.current = true;
		let Fin4MessagesContract = context.drizzle.contracts.Fin4Messages;

		getContractData(Fin4MessagesContract, props.defaultAccount, 'getMyMessagesCount')
			.then(data => {
				var messageCount = Number(data);
				var messageIndices = [];
				for (var i = 0; i < messageCount; i++) {
					messageIndices.push(i);
				}
				return messageIndices.map(index => {
					return getContractData(Fin4MessagesContract, props.defaultAccount, 'getMyMessage', index).then(
						({
							0: messageType,
							1: sender,
							2: message,
							3: fulfillmentAddress,
							4: proofTypeName,
							5: hasBeenActedUpon,
							6: attachment,
							7: pendingApprovalId
						}) => {
							return {
								messageType: messageType.toString(),
								sender: sender,
								message: message,
								fulfillmentAddress: fulfillmentAddress,
								proofTypeName: proofTypeName,
								hasBeenActedUpon: hasBeenActedUpon,
								attachment: attachment,
								pendingApprovalId: pendingApprovalId
							};
						}
					);
				});
			})
			.then(data => Promise.all(data))
			.then(data => {
				setMessages(data);
			});
	};

	return (
		messages.length > 0 &&
		messages.filter(msg => !msg.hasBeenActedUpon).length > 0 && (
			<Box title="Messages">
				{messages
					.filter(msg => !msg.hasBeenActedUpon)
					.map((msg, index) => {
						return (
							<Message key={`${msg.proofTypeName}_${msg.fulfillmentAddress}_${index}`}>
								<Typography color="textSecondary" variant="body2">
									{msg.message}.
								</Typography>
								{msg.messageType === '1' && ( // --> enum MessageType { INFO, APPROVAL }
									<>
										<Divider style={{ margin: '10px 0' }} variant="middle" />
										<Typography color="textSecondary" variant="body2">
											Requested by {msg.sender}
										</Typography>
										<Divider style={{ margin: '10px 0' }} variant="middle" />
										{msg.attachment && msg.attachment.length > 0 && (
											<Button
												center="true"
												icon={Photo}
												onClick={() => window.open('https://gateway.ipfs.io/ipfs/' + msg.attachment, '_blank')}>
												Click to see the image
											</Button>
										)}
										<ContractForm
											buttonLabel="approve"
											contractAddress={msg.fulfillmentAddress}
											// instead of passing the proofTypeName, make an extra getName() call for that?
											contractName={msg.proofTypeName}
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
		contracts: state.contracts,
		defaultAccount: state.fin4Store.defaultAccount
	};
};

export default drizzleConnect(Messages, mapStateToProps);
