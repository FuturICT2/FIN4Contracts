import React, { useState, useEffect, useRef } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import {
	findTokenBySymbol,
	getFin4TokensFormattedForSelectOptions,
	addContract
} from '../../components/Contractor.jsx';
import AddressQRreader from '../../components/AddressQRreader';
import Dropdown from '../../components/Dropdown';
import { TextField } from '@material-ui/core';
import Button from '../../components/Button';
import { isValidPublicAddress } from '../../components/Contractor';

function UserTransfer(props, context) {
	const { t } = useTranslation();

	const [userAddressViaURL, setUserAddressViaURL] = useState(null);
	const [tokenViaURL, setTokenViaURL] = useState(null); // formatted for Select-Dropdown
	const userAddressValue = useRef(null);
	const tokenAddressValue = useRef(null);
	const amount = useRef(null);

	useEffect(() => {
		let userAddress = props.match.params.userAddress;
		if (userAddress && !userAddressViaURL) {
			setUserAddressViaURL(userAddress);
			userAddressValue.current = userAddress;
		}
		let tokenSymbol = props.match.params.tokenSymbol;
		if (!tokenViaURL && tokenSymbol) {
			let token = findTokenBySymbol(props, tokenSymbol);
			if (token) {
				setTokenViaURL({
					value: token.address,
					label: token.name,
					symbol: token.symbol
				});
				tokenAddressValue.current = token.address;
			}
		}
		// TODO
	});

	const sendTransfer = () => {
		let user = userAddressValue.current;
		let token = props.fin4Tokens[tokenAddressValue.current];
		addContract(props, context.drizzle, 'Fin4Token', tokenAddressValue.current, [], token.symbol);

		// TODO
	};

	return (
		<Container>
			<Box title="Send tokens to user">
				<center>
					<AddressQRreader initialValue={userAddressViaURL} onChange={val => (userAddressValue.current = val)} />
					<Dropdown
						key="token-dropdown"
						onChange={e => (tokenAddressValue.current = e.value)}
						options={getFin4TokensFormattedForSelectOptions(props.fin4Tokens)}
						label={t('token-type')}
						defaultValue={tokenViaURL}
					/>
					<TextField
						key="amount-field"
						type="number"
						label="Amount"
						onChange={e => (amount.current = e.target.value)}
						style={inputFieldStyle}
					/>
					<br />
					<br />
					<Button
						onClick={() => {
							if (!isValidPublicAddress(userAddressValue.current)) {
								alert('Invalid Ethereum public address');
								return;
							}
							if (!props.fin4Tokens[tokenAddressValue.current]) {
								alert('No token selected');
								return;
							}
							if (amount.current <= 0) {
								alert('Amount to transfer must bigger than 0');
								return;
							}

							// TODO check if user has enough balance on that token

							sendTransfer();
						}}>
						Send
					</Button>
				</center>
			</Box>
		</Container>
	);
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

UserTransfer.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(UserTransfer, mapStateToProps);
