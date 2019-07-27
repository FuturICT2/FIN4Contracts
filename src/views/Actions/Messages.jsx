import React, { Component } from 'react';
import Box from '../../components/Box';
import ContractForm from '../../components/ContractForm';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData, getNetworkName, getNetworkBalance } from '../../components/Contractor';
import Button from '../../components/Button';
import Photo from '@material-ui/icons/Photo';
import { Typography, Divider, Paper } from '@material-ui/core';
import styled from 'styled-components';
import { Fin4MainAddress } from '../../config/DeployedAddresses.js';

class Messages extends Component {
	constructor(props) {
		super(props);

		this.state = {
			messages: []
		};

		getContractData(Fin4MainAddress, 'Fin4Main', 'getFin4MessagesAddress', []).then(Fin4MessagesAddress => {
			getContractData(Fin4MessagesAddress, 'Fin4Messages', 'getMyMessagesCount', [])
				.then(data => {
					var messageCount = Number(data);
					var messageIndices = [];
					for (var i = 0; i < messageCount; i++) {
						messageIndices.push(i);
					}
					return messageIndices.map(index => {
						return getContractData(Fin4MessagesAddress, 'Fin4Messages', 'getMyMessage', [index]).then(
							({
								0: messageType,
								1: sender,
								2: message,
								3: fulfillmentAddress,
								4: proofTypeName,
								5: hasBeenActedUpon,
								6: attachment
							}) => {
								return {
									messageType: messageType.toString(),
									sender: sender,
									message: message,
									fulfillmentAddress: fulfillmentAddress,
									proofTypeName: proofTypeName,
									hasBeenActedUpon: hasBeenActedUpon,
									attachment: attachment
								};
							}
						);
					});
				})
				.then(data => Promise.all(data))
				.then(data => {
					this.setState({ messages: data });
				});
		});

		// add a message if the users ETH balance is 0
		// causes errors on startup sometimes TODO fix
		/*getNetworkBalance().then(result => {
			if (result.c[0] > 0) return;
			getNetworkName().then(name => {
				let msg = {
					messageType: '1',
					message: 'It looks like your current ' + name + " account has 0 ETH. You won't be able to make transactions",
					fulfillmentAddress: '0x0',
					proofTypeName: 'dummy',
					hasBeenActedUpon: false
				};
				this.setState(prevState => ({
					messages: [...prevState.messages, msg]
				}));
			});
		});*/

		// add a message if the Fin4Main contract could not be found on the network
		// could happen because of the wrong address in DeployedAddresses.js and/or the wrong network in MetaMask
		// TODO
	}

	render() {
		return (
			this.state.messages.length > 0 && (
				<Box title="Messages">
					{this.state.messages.map(msg => {
						if (msg.hasBeenActedUpon) {
							return '';
						}
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
										{msg.attachment && msg.attachment.length > 0 && (
											<Button
												center
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
