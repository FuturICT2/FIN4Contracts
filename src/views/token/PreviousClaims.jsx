import React, { useState, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Box from '../../components/Box';
import Currency from '../../components/Currency';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import ProofSubmission from './ProofSubmission';
import { Chip, Typography, Divider, Grid, Paper, createMuiTheme } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import colors from '../../config/colors-config';
import DateIcon from '@material-ui/icons/AccessTime';
import ProofIcon from '@material-ui/icons/Fingerprint';
import moment from 'moment';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

function PreviousClaims(props) {
	const proofModalValues = useRef({
		tokenAddress: null,
		claimId: null
	});

	const [isProofModalOpen, setIsProofModalOpen] = useState(false);

	const { t, i18n } = useTranslation();

	const toggleProofModal = () => {
		if (isProofModalOpen) {
			proofModalValues.current.tokenAddress = null;
			proofModalValues.current.claimId = null;
		}
		setIsProofModalOpen(!isProofModalOpen);
	};

	return (
		<>
			<Box title={t('my-previous-claims')}>
				{Object.keys(props.usersClaims).map(pseudoClaimId => {
					let claim = props.usersClaims[pseudoClaimId];
					let token = props.store.getState().fin4Store.fin4Tokens[claim.token];
					let dateStr = claim.date.toString();

					// crop last 3 digits (milliseconds) of date and apply human readable .calendar() function
					// TODO divide by 1000 instead?
					let date = moment.unix(Number(dateStr.substring(0, dateStr.length - 3))).calendar();
					return (
						<Claim isapproved={claim.isApproved ? 'true' : 'false'} key={`${claim.token}${claim.claimId}`}>
							<div>
								<Grid container alignItems="center">
									<Grid item xs>
										<Typography gutterBottom variant="h5">
											{token.name}
										</Typography>
									</Grid>
									<Grid item>
										<Typography gutterBottom variant="h6">
											{claim.quantity} <Currency symbol={token.symbol} />
										</Typography>
									</Grid>
								</Grid>
								{claim.comment && (
									<Typography color="textSecondary" variant="body2">
										{claim.comment}
									</Typography>
								)}
							</div>
							<Divider style={{ margin: '10px 0' }} variant="middle" />
							<ThemeProvider theme={chipTheme}>
								<Chip key="0" color="primary" icon={<DateIcon />} label={date} style={{ margin: '0 7px 7px 0' }} />
							</ThemeProvider>
							<ThemeProvider theme={buttonTheme}>
								<Button
									icon={ProofIcon}
									onClick={() => {
										proofModalValues.current.tokenAddress = claim.token;
										proofModalValues.current.claimId = claim.claimId;
										toggleProofModal();
									}}
									color={claim.isApproved ? 'primary' : 'secondary'}
									style={{ margin: '0 7px 7px 0' }}>
									{claim.isApproved ? t('approved') : t('submit-proof-short')}
								</Button>
							</ThemeProvider>
						</Claim>
					);
				})}
			</Box>
			<Modal isOpen={isProofModalOpen} handleClose={toggleProofModal} title={t('submit-proof-long')} width="450px">
				<ProofSubmission
					tokenAddress={proofModalValues.current.tokenAddress}
					claimId={proofModalValues.current.claimId}
				/>
			</Modal>
		</>
	);
}

const chipTheme = createMuiTheme({
	palette: {
		primary: {
			main: colors.light,
			contrastText: colors.main
		}
	}
});

const buttonTheme = createMuiTheme({
	palette: {
		primary: {
			main: 'rgba(61, 219, 81, 0.7)',
			contrastText: colors.light
		},
		secondary: {
			main: 'rgba(248, 57, 48, 0.7)',
			contrastText: colors.light
		}
	}
});

const Claim = styled(Paper)`
	&& {
		box-sizing: border-box;
		margin: 15px 0;
		padding: 15px;
		background: ${props => (props.isapproved === 'true' ? colors.true : colors.wrong)};
	}
`;

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		usersClaims: state.fin4Store.usersClaims
	};
};

export default drizzleConnect(PreviousClaims, mapStateToProps);
