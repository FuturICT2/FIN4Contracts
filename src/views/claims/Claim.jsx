import React, { useState, useRef, useEffect } from 'react';
import Container from '../../components/Container';
import Box from '../../components/Box';
import Button from '../../components/Button';
import { TextField } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import moment from 'moment';
import AddIcon from '@material-ui/icons/Add';
import Dropdown from '../../components/Dropdown';
import PreviousClaims from './PreviousClaims';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import { findTokenBySymbol } from '../../components/Contractor.jsx';
import PropTypes from 'prop-types';

function Claim(props, context) {
	const { t } = useTranslation();

	const [tokenViaURL, setTokenViaURL] = useState(null);
	const [unit, setUnit] = useState(t('quantity'));

	const values = useRef({
		tokenAddress: null,
		quantity: 0, // or null and avoid submitting it? TODO --> #ConceptualDecision
		date: moment().valueOf(),
		comment: ''
	});

	const submitClaim = () => {
		let val = values.current;
		if (val.tokenAddress === null) {
			alert('Token must be selected');
			return;
		}
		context.drizzle.contracts.Fin4Claiming.methods
			.submitClaim(val.tokenAddress, val.quantity, val.date, val.comment)
			.send({
				from: props.store.getState().fin4Store.defaultAccount
			})
			.then(function(result) {
				console.log('Results of submitting: ', result);
			});
	};

	const getFormattedSelectOptions = () => {
		return Object.keys(props.fin4Tokens).map(addr => {
			let token = props.fin4Tokens[addr];
			return {
				value: token.address,
				label: token.name,
				symbol: token.symbol
			};
		});
	};

	useEffect(() => {
		let symbol = props.match.params.tokenSymbol;
		if (!tokenViaURL && Object.keys(props.fin4Tokens).length > 0 && symbol) {
			let token = findTokenBySymbol(props, symbol);
			if (token) {
				setTokenViaURL(token);
				updateSelectedOption(token.address);
			} else {
				console.log(symbol + ' was passed as token-symbol via URL but does not match a known token');
			}
		}
	});

	const updateSelectedOption = tokenAddr => {
		values.current.tokenAddress = tokenAddr;
		let unit = props.fin4Tokens[values.current.tokenAddress].unit;
		setUnit(unit.length > 0 ? unit : t('quantity'));
	};

	return (
		<Container>
			<div>
				<Box title={t('claim-tokens')}>
					<Dropdown
						key="token-dropdown"
						onChange={e => updateSelectedOption(e.value)}
						options={getFormattedSelectOptions()}
						label={t('token-type')}
						defaultValue={
							tokenViaURL
								? {
										value: tokenViaURL.address,
										label: tokenViaURL.name,
										symbol: tokenViaURL.symbol
								  }
								: null
						}
					/>
					<TextField
						key="quantity-field"
						type="number"
						label={unit}
						onChange={e => (values.current.quantity = e.target.value)}
						style={inputFieldStyle}
					/>
					<ClaimTimePicker
						defaultDate={values.current.date}
						updateDate={date => {
							values.current.date = date.valueOf();
						}}
					/>
					<TextField
						key="comment-field"
						type="text"
						label={t('comment')}
						onChange={e => (values.current.comment = e.target.value)}
						style={inputFieldStyle}
					/>
					<Button icon={AddIcon} onClick={submitClaim} center="true">
						Submit
					</Button>
				</Box>
			</div>
			<PreviousClaims />
		</Container>
	);
}

function ClaimTimePicker(props) {
	const { t } = useTranslation();
	const [date, setDate] = useState(moment(props.defaultDate));
	return (
		<MuiPickersUtilsProvider key="date-field" utils={DateFnsUtils}>
			<DateTimePicker
				ampm={false}
				disableFuture
				showTodayButton
				key="date-picker"
				label={t('date')}
				format={dateFormat}
				value={date}
				onChange={moment => {
					setDate(moment);
					props.updateDate(moment);
				}}
				style={inputFieldStyle}
			/>
		</MuiPickersUtilsProvider>
	);
}

const dateFormat = 'YYYY-MM-DD HH:mm';

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

Claim.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(Claim, mapStateToProps);
