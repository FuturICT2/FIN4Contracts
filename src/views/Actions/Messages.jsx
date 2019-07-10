import React, { Component } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../components/ContractData';
import { Chip, Typography, Divider, Paper, createMuiTheme } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import ProofIcon from '@material-ui/icons/Fingerprint';
import colors from '../../config/colors-config';
import styled from 'styled-components';

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
					return getContractData('Fin4Main', 'Fin4Main.json', 'getMyMessage', [index], context.drizzle).then(
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
	}

	render() {
		return (
			this.state.messages.length > 0 && (
				<Box title="Messages">
					{this.state.messages.map(msg => {
						return (
							<Message key={`${msg.proofTypeName}${msg.fulfillmentAddress}`}>
								<Typography color="textSecondary" variant="body2">
									{msg.message}
								</Typography>
								{msg.messageType === '0' && (
									<>
										<Divider style={{ margin: '10px 0' }} variant="middle" />
										<Typography color="textSecondary" variant="body2">
											Requested by {msg.sender}
										</Typography>
										<Divider style={{ margin: '10px 0' }} variant="middle" />
										<ThemeProvider theme={chipTheme}>
											<Chip
												key="1"
												color="secondary"
												icon={<ProofIcon />}
												component="a"
												href={`/approving?fulfillmentAddress=${msg.fulfillmentAddress}&proofTypeName=${msg.proofTypeName}`}
												clickable={true}
												// onClick={() => {
												// 	this.setState({
												// 		actionTypeAddressForProofModal: actionTypeAddress,
												// 		claimIdForProofModal: claimId
												// 	});
												// }}
												label="approve"
											/>
										</ThemeProvider>
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

const chipTheme = createMuiTheme({
	palette: {
		secondary: {
			main: 'rgba(0, 0, 0, .3)',
			contrastText: colors.light
		}
	}
});

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
