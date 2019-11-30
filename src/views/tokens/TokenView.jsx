import React, { useState, useEffect, useRef } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Currency from '../../components/Currency';
import { getContractData, findTokenBySymbol, addContract } from '../../components/Contractor';
import PropTypes from 'prop-types';
import { Divider } from '@material-ui/core';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, FormControlLabel } from '@material-ui/core';

function TokenView(props, context) {
	const { t } = useTranslation();

	const [tokenViaURL, setTokenViaURL] = useState(null);
	const [details, setDetails] = useState(null);
	const [proofTypesLoaded, setProofTypesLoaded] = useState(false);

	const fetchDetailedTokenInfo = () => {
		getContractData(
			context.drizzle.contracts['Fin4Token_' + tokenViaURL.symbol],
			props.defaultAccount,
			'getDetailedTokenInfo'
		).then(
			({
				0: requiredProofTypes,
				1: claimsCount,
				2: usersBalance,
				3: totalSupply,
				4: tokenCreationTime,
				5: boolPropertiesArr,
				6: uintValuesArr,
				7: actionsText
			}) => {
				setDetails({
					requiredProofTypes: requiredProofTypes,
					claimsCount: claimsCount,
					usersBalance: usersBalance,
					totalSupply: totalSupply, // how much of this token has been minted
					tokenCreationTime: moment.unix(tokenCreationTime).calendar(),
					isTransferable: boolPropertiesArr[0],
					isMintable: boolPropertiesArr[1],
					isBurnable: boolPropertiesArr[2],
					isCapped: boolPropertiesArr[3],
					cap: uintValuesArr[0],
					decimals: uintValuesArr[1],
					fixedQuantity: uintValuesArr[2],
					userDefinedQuantityFactor: uintValuesArr[3],
					initialSupply: uintValuesArr[4],
					actionsText: actionsText
				});
			}
		);
	};

	const getProofTypesStr = () => {
		let str = '';
		for (let i = 0; i < details.requiredProofTypes.length; i++) {
			str += props.proofTypes[details.requiredProofTypes[i]].label + ', ';
		}
		return str.substring(0, str.length - 2);
	};

	const contractReady = name => {
		return props.contracts[name] && props.contracts[name].initialized;
	};

	const detailsFetchingInitiated = useRef(false);

	useEffect(() => {
		let symbol = props.match.params.tokenSymbol;
		if (!tokenViaURL && Object.keys(props.fin4Tokens).length > 0 && symbol) {
			// best approach to avoid duplicate and get timing right?
			let token = findTokenBySymbol(props, symbol);
			if (token) {
				setTokenViaURL(token);
				let tokenNameSuffixed = 'Fin4Token_' + token.symbol;
				if (!contractReady(tokenNameSuffixed)) {
					addContract(props, context.drizzle, 'Fin4Token', token.address, [], tokenNameSuffixed);
				}
			}
		}

		if (!detailsFetchingInitiated.current && tokenViaURL && contractReady('Fin4Token_' + tokenViaURL.symbol)) {
			detailsFetchingInitiated.current = true;
			fetchDetailedTokenInfo();
		}

		// TODO is there no other way? seems awkward
		if (!proofTypesLoaded && Object.keys(props.proofTypes).length > 0) {
			setProofTypesLoaded(true);
		}
	});

	const buildInfoLine = (label, value) => {
		return (
			<p>
				<span style={{ color: 'gray' }}>{label}:</span> {value}
			</p>
		);
	};

	const buildCheckboxWithLabel = (label, checked) => {
		return (
			<>
				<FormControlLabel control={<Checkbox checked={checked} disabled={true} />} label={label} />
				<br />
			</>
		);
	};

	// TODO move to utils and use that here and in TokenSubmission
	const getSubmissionsOnToken = () => {
		if (!tokenViaURL) {
			return [];
		}
		return Object.keys(props.submissions)
			.map(subId => props.submissions[subId])
			.filter(sub => sub.token === tokenViaURL.address);
	};

	return (
		<Container>
			<Box>
				{!tokenViaURL ? (
					props.match.params.tokenSymbol ? (
						<span style={{ fontFamily: 'arial' }}>
							No token with symbol <b>{props.match.params.tokenSymbol}</b> found
						</span>
					) : (
						<span style={{ fontFamily: 'arial' }}>No token-symbol passed via URL</span>
					)
				) : (
					<span style={{ fontFamily: 'arial' }}>
						<center>
							<Currency symbol={tokenViaURL.symbol} name={<b>{tokenViaURL.name}</b>} />
							<br />
							<span style={{ fontSize: 'x-small' }}>
								<a href={'https://rinkeby.etherscan.io/address/' + tokenViaURL.address} target="_blank">
									{tokenViaURL.address}
								</a>
							</span>
						</center>
						<br />
						{getSubmissionsOnToken().length > 0 && (
							// TODO make visible with 0 submissions too?
							// Requires passing that info through back/frontend differently though
							<p>
								<span style={{ color: 'gray' }}>Submissions: </span>
								<Link
									to={
										'/token/submissions/' +
										tokenViaURL.symbol + // weird to just look at [0]
										(getSubmissionsOnToken()[0].contentType === '0' ? '/text' : '/picture')
									}>
									open {getSubmissionsOnToken()[0].contentType === '0' ? 'text' : 'picture'} collage
								</Link>
							</p>
						)}
						{buildInfoLine('Description', tokenViaURL.description)}
						{!details ? (
							<span style={{ fontFamily: 'arial' }}>Loading details...</span>
						) : (
							<span style={{ fontFamily: 'arial' }}>
								<Divider style={{ margin: '10px 0' }} variant="middle" />

								{buildInfoLine('Created at', details.tokenCreationTime)}
								{buildInfoLine('Proof types', proofTypesLoaded ? getProofTypesStr() : 'Loading...')}
								{buildInfoLine('Total number of claims', details.claimsCount)}
								{buildInfoLine('Total supply', details.totalSupply)}

								<Divider style={{ margin: '10px 0' }} variant="middle" />

								{buildCheckboxWithLabel('is transferable', details.isTransferable)}
								{buildCheckboxWithLabel('is mintable', details.isMintable)}
								{buildCheckboxWithLabel('is burnable', details.isBurnable)}
								{buildCheckboxWithLabel('is capped', details.isCapped)}

								<Divider style={{ margin: '10px 0' }} variant="middle" />

								{buildInfoLine('Cap', details.cap)}
								{buildInfoLine('Decimals', details.decimals)}
								{buildInfoLine('Initial supply', details.initialSupply)}

								<Divider style={{ margin: '10px 0' }} variant="middle" />

								{buildInfoLine('Fixed minting quantity per claim', details.fixedQuantity)}
								{buildInfoLine('Minting user-given quantity times', details.userDefinedQuantityFactor)}
								{buildInfoLine('Claimable actions', details.actionsText)}
							</span>
						)}
					</span>
				)}
			</Box>
			<Box title="Token Profile">
				{!details ? (
					<span style={{ fontFamily: 'arial' }}>Loading your profile...</span>
				) : (
					<span style={{ fontFamily: 'arial' }}>
						{buildInfoLine('Your balance', details.usersBalance)}
						<Divider style={{ margin: '10px 0' }} variant="middle" />
						<span style={{ color: 'gray' }}>Token actions: </span>
						{(tokenViaURL.userIsCreator || tokenViaURL.userIsAdmin) && (
							<>
								<Link to={'/token/edit/' + tokenViaURL.symbol}>Edit</Link>
								{', '}
							</>
						)}
						<Link to={'/claim/' + tokenViaURL.symbol}>Claim</Link>
						{', '}
						<Link to={'/user/transfer'}>Transfer</Link> {/* TODO support symbol, no user */}
					</span>
				)}
			</Box>
		</Container>
	);
}

TokenView.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		defaultAccount: state.fin4Store.defaultAccount,
		fin4Tokens: state.fin4Store.fin4Tokens,
		submissions: state.fin4Store.submissions,
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenView, mapStateToProps);
