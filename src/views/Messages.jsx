import React, { useEffect } from 'react';
import Box from '../components/Box';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import Photo from '@material-ui/icons/Photo';
import { Typography, Divider, Paper } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { fetchMessage } from '../components/Contractor';

function Messages(props, context) {
	const { t } = useTranslation();

	useEffect(() => {
		// missing messageType = indicator that this is only a message stub
		props.messages
			.filter(msg => !msg.messageType)
			.map(msg => {
				fetchMessage(
					context.drizzle.contracts.Fin4Messages,
					props.store.getState().fin4Store.defaultAccount,
					msg.messageId
				).then(message => {
					props.dispatch({
						type: 'UPDATE_STUB_MESSAGE',
						message: message
					});
				});
			});
	});

	const submitApproval = (proofTypeName, pendingApprovalId) => {
		context.drizzle.contracts[proofTypeName].methods
			.receiveApprovalFromSpecificAddress(pendingApprovalId)
			.send({
				from: props.defaultAccount
			})
			.then(function(result) {
				console.log('Results of submitting: ', result);
			});
	};

	const getIntroText = messageType => {
		switch (messageType) {
			case '0':
				return 'Info';
			case '1':
				return 'Approval Request';
			case '2':
				return 'From User';
		}
	};

	return (
		props.messages.filter(msg => !msg.hasBeenActedUpon && msg.messageType).length > 0 && (
			<Box title="Messages">
				{props.messages
					.filter(msg => !msg.hasBeenActedUpon && msg.messageType)
					.map((msg, index) => {
						return (
							<Message key={`${msg.proofTypeName}_${msg.pendingApprovalId}_${index}`}>
								<span style={{ color: 'gray' }}>
									<Typography color="inherit" variant="body2">
										<b>{getIntroText(msg.messageType).toUpperCase()}</b>
									</Typography>
								</span>
								<Typography color="textSecondary" variant="body2">
									{msg.message}
								</Typography>
								{/* Fin4Messages.sol: enum MessageType { INFO, APPROVAL, USER2USER } */}
								{msg.messageType === '1' && (
									<>
										<Divider style={{ margin: '10px 0' }} variant="middle" />
										<Typography color="textSecondary" variant="body2">
											Requested by {msg.sender}
										</Typography>
										<br />
										{msg.attachment && msg.attachment.length > 0 && (
											<>
												<Button
													center="true"
													icon={Photo}
													onClick={() => window.open('https://gateway.ipfs.io/ipfs/' + msg.attachment, '_blank')}>
													Click to see the image
												</Button>
												<br />
											</>
										)}
										<center>
											<span style={{ color: 'green' }}>
												<Button
													color="inherit"
													icon={ThumbUpIcon}
													onClick={() => submitApproval(msg.proofTypeName, msg.pendingApprovalId)}>
													Approve
												</Button>
											</span>
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											<span style={{ color: 'red' }}>
												<Button color="inherit" icon={ThumbDownIcon} onClick={() => {}}>
													Reject
												</Button>
											</span>
										</center>
										<br />
									</>
								)}
								<Divider style={{ margin: '10px 0' }} variant="middle" />
								<center>
									<MsgResponseLink onClick={() => {}}>MARK AS READ</MsgResponseLink>
									{msg.messageType !== '0' && (
										<>
											&nbsp;&nbsp;&nbsp;
											<MsgResponseLink onClick={() => {}}>REPLY</MsgResponseLink>
										</>
									)}
								</center>
							</Message>
						);
					})}
			</Box>
		)
	);
}

const MsgResponseLink = styled.a`
	font-family: arial;
	color: gray;
	font-size: small;
	text-decoration: underline;
`;

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
		defaultAccount: state.fin4Store.defaultAccount,
		messages: state.fin4Store.messages
	};
};

export default drizzleConnect(Messages, mapStateToProps);
