import React, { useState, useEffect, useRef } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Button from '../../components/Button';
import TextField from '@material-ui/core/TextField';
import MessageIcon from '@material-ui/icons/Message';
import AddressQRreader from '../../components/AddressQRreader';
import { isValidPublicAddress } from '../../components/Contractor';
import PropTypes from 'prop-types';

function UserSite(props, context) {
	const { t } = useTranslation();

	const [userAddressViaURL, setUserAddressViaURL] = useState(null);
	const msgText = useRef('');
	const addressValue = useRef('');

	useEffect(() => {
		let userAddress = props.match.params.userAddress;
		if (userAddress && !userAddressViaURL) {
			setUserAddressViaURL(userAddress);
		}
	});

	const sendMessage = () => {
		context.drizzle.contracts.Fin4Messages.methods
			.addUserMessage(addressValue.current, msgText.current)
			.send({
				from: props.store.getState().fin4Store.defaultAccount
			})
			.then(function(result) {
				console.log('Results of submitting: ', result);
			});
	};

	return (
		<Container>
			<Box title="Send message to user">
				<center>
					<AddressQRreader initialValue={userAddressViaURL} onChange={val => (addressValue.current = val)} />
					<br />
					<TextField
						label="Message text"
						multiline
						rows="4"
						fullWidth
						variant="outlined"
						onChange={e => (msgText.current = e.target.value)}
					/>
					<br />
					<small style={{ color: 'gray', fontFamily: 'arial' }}>
						Note that messages are not encrypted. With some effort they can be retrieved in plain text from the
						blockchain.
					</small>
					<br />
					<br />
					<Button
						icon={MessageIcon}
						onClick={() => {
							if (!isValidPublicAddress(addressValue.current)) {
								alert('Invalid Ethereum public address');
								return;
							}
							sendMessage();
						}}>
						Send
					</Button>
					<br />
					<br />
				</center>
			</Box>
		</Container>
	);
}

UserSite.contextTypes = {
	drizzle: PropTypes.object
};

export default drizzleConnect(UserSite);
