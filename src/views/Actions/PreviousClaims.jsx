import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../components/Contractor';
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
import { Fin4MainAddress } from '../../config/DeployedAddresses.js';

class PreviousClaims extends Component {
	constructor(props) {
		super(props);

		this.state = {
			claims: [],
			isProofModalOpen: false
		};

		getContractData(Fin4MainAddress, 'Fin4Main', 'getActionsWhereUserHasClaims')
			.then(actionTypeAddresses => {
				// action types
				return actionTypeAddresses.map(actionTypeAddress => {
					return getContractData(actionTypeAddress, 'Fin4Token', 'getMyClaimIds')
						.then(({ 1: tokenName, 2: tokenSymbol, 3: claimIds }) => {
							// claim ids per action type
							return claimIds.map(claimId => {
								return {
									claimId: claimId,
									actionTypeAddress: actionTypeAddress,
									tokenName: tokenName,
									tokenSymbol: tokenSymbol
								};
							});
						})
						.then(claims => {
							return claims.map(({ claimId, actionTypeAddress, tokenName, tokenSymbol }) => {
								return getContractData(actionTypeAddress, 'Fin4Token', 'getClaimInfo', [claimId]).then(
									({ 1: isApproved, 2: quantity, 3: date, 4: comment }) => {
										// claims per claim id per action type
										return {
											claimId: claimId,
											actionTypeAddress: actionTypeAddress,
											tokenName: tokenName,
											tokenSymbol: tokenSymbol,
											isApproved: isApproved,
											quantity: quantity.toString(),
											date: date.toString(),
											comment: comment
										};
									}
								);
							});
						});
				});
			})
			.then(data => Promise.all(data))
			.then(data => data.flat())
			.then(data => Promise.all(data))
			.then(data => {
				data.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
				this.setState({ claims: data });
			});
		this.resetProofModalValues();
	}

	resetProofModalValues() {
		this.proofModalValues = {
			actionTypeAddress: null,
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
			this.state.claims.length > 0 && (
				<>
					<Box title="My Previous Claims">
						{this.state.claims.map(
							({ claimId, actionTypeAddress, tokenName, tokenSymbol, isApproved, quantity, date, comment }) => {
								// crop last 3 digits (milliseconds) of date and apply human readable .calendar() function
								date = moment.unix(Number(date.substring(0, date.length - 3))).calendar();
								return (
									<Claim isapproved={isApproved ? 'true' : 'false'} key={`${actionTypeAddress}${claimId}`}>
										<div>
											<Grid container alignItems="center">
												<Grid item xs>
													<Typography gutterBottom variant="h5">
														{tokenName}
													</Typography>
												</Grid>
												<Grid item>
													<Typography gutterBottom variant="h6">
														{quantity} <Currency symbol={tokenSymbol} />
													</Typography>
												</Grid>
											</Grid>
											{comment && (
												<Typography color="textSecondary" variant="body2">
													{comment}
												</Typography>
											)}
										</div>
										<Divider style={{ margin: '10px 0' }} variant="middle" />
										<ThemeProvider theme={chipTheme}>
											<Chip
												key="0"
												color="primary"
												icon={<DateIcon />}
												label={date}
												style={{ margin: '0 7px 7px 0' }}
											/>
										</ThemeProvider>
										<ThemeProvider theme={buttonTheme}>
											<Button
												icon={ProofIcon}
												onClick={() => {
													this.proofModalValues.actionTypeAddress = actionTypeAddress;
													this.proofModalValues.claimId = claimId;
													this.toggleProofModal();
												}}
												color={isApproved ? 'primary' : 'secondary'}
												style={{ margin: '0 7px 7px 0' }}>
												{isApproved ? 'approved' : 'submit proof'}
											</Button>
										</ThemeProvider>
									</Claim>
								);
							}
						)}
					</Box>
					<Modal
						isOpen={this.state.isProofModalOpen}
						handleClose={this.toggleProofModal}
						title="Submit Proofs"
						width="450px">
						<ProofSubmission
							tokenAddress={this.proofModalValues.actionTypeAddress}
							claimId={this.proofModalValues.claimId}
						/>
					</Modal>
				</>
			)
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
		contracts: state.contracts
	};
};

export default drizzleConnect(PreviousClaims, mapStateToProps);
