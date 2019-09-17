import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
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

class PreviousClaims extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isProofModalOpen: false
		};

		this.resetProofModalValues();
	}

	resetProofModalValues() {
		this.proofModalValues = {
			tokenAddress: null,
			claimId: null
		};
	}

	toggleProofModal = () => {
		if (this.state.isProofModalOpen) {
			this.resetProofModalValues();
		}
		this.setState({ isProofModalOpen: !this.state.isProofModalOpen });
	};

	render() {
		return (
			<>
				<Box title="My Previous Claims">
					{Object.keys(this.props.usersClaims).map(pseudoClaimId => {
						let claim = this.props.usersClaims[pseudoClaimId];
						let token = this.props.store.getState().fin4Store.fin4Tokens[claim.token];
						let dateStr = claim.date.toString();

						// crop last 3 digits (milliseconds) of date and apply human readable .calendar() function
						// TODO divide by 1000 instead?
						let date = moment.unix(Number(dateStr.substring(0, dateStr.length - 3))).calendar();
						return (
							<Claim isapproved={claim.isApproved ? 'true' : 'false'} key={`${claim.tokenAddress}${claim.claimId}`}>
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
											this.proofModalValues.tokenAddress = claim.token;
											this.proofModalValues.claimId = claim.claimId;
											this.toggleProofModal();
										}}
										color={claim.isApproved ? 'primary' : 'secondary'}
										style={{ margin: '0 7px 7px 0' }}>
										{claim.isApproved ? 'approved' : 'submit proof'}
									</Button>
								</ThemeProvider>
							</Claim>
						);
					})}
				</Box>
				<Modal
					isOpen={this.state.isProofModalOpen}
					handleClose={this.toggleProofModal}
					title="Submit Proofs"
					width="450px">
					<ProofSubmission tokenAddress={this.proofModalValues.tokenAddress} claimId={this.proofModalValues.claimId} />
				</Modal>
			</>
		);
	}
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

PreviousClaims.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		usersClaims: state.fin4Store.usersClaims
	};
};

export default drizzleConnect(PreviousClaims, mapStateToProps);
