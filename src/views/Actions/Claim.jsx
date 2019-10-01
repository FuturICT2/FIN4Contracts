import React, { useState, useRef } from 'react';
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
import { Fin4MainAddress } from '../../config/DeployedAddresses';

function Claim(props) {
	const { t } = useTranslation();

	const [unit, setUnit] = useState(t('quantity'));

	const values = useRef({
		tokenAddress: null,
		quantity: null,
		comment: null,
		date: moment().valueOf()
	});

	const submitClaim = () => {
		// TODO
		console.log(values.current);
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

	return (
		<Container>
			<div>
				<Box title={t('claim-tokens')}>
					<Dropdown
						key="token-dropdown"
						onChange={e => {
							values.current.tokenAddress = e.value;
							// setUnit('');
						}}
						options={getFormattedSelectOptions()}
						label={t('token-type')}
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

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(Claim, mapStateToProps);
