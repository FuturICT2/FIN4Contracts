import React, { Component } from 'react';
import { Fin4Box } from '../../Elements';
import ContractData from '../../ContractData';
import { Chip, Typography, Divider, Grid, Paper, createMuiTheme } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import colors from '../../config/colors-config';
import DateIcon from '@material-ui/icons/AccessTime';
import moment from 'moment';
import styled from 'styled-components';

class PreviousClaims extends Component {
	chipTheme = createMuiTheme({
		palette: {
			primary: {
				main: colors.light,
				contrastText: colors.main
			},
			secondary: {
				main: 'rgba(248, 57, 48, 0.5)',
				contrastText: colors.light
			}
		}
	});
	showClaim = (
		{ 0: claimer, 1: isApproved, 2: quantity, 3: date, 4: comment },
		[tokenAddress, tokenName, tokenSymbol, claimId]
	) => {
		// crop last 3 digits (milliseconds) of date and apply human readable .calendar() function
		date = moment.unix(Number(date.substring(0, date.length - 3))).calendar();
		return (
			<Claim isapproved={isApproved.toString()}>
				<div>
					<Grid container alignItems="center">
						<Grid item xs>
							<Typography gutterBottom variant="h5">
								{tokenName}
							</Typography>
						</Grid>
						<Grid item>
							<Typography gutterBottom variant="h6">
								{quantity} <Currency>{tokenSymbol}</Currency>
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
				<ThemeProvider theme={this.chipTheme}>
					<Chip key="0" color="primary" icon={<DateIcon />} label={date} style={{ marginRight: '20px' }} />
					<Chip
						key="1"
						color={isApproved ? 'primary' : 'secondary'}
						component={isApproved ? 'span' : 'a'}
						clickable={!isApproved}
						href={isApproved ? '' : `/proof?tokenAddress=${tokenAddress}&claimId=${claimId}`}
						label={isApproved ? 'approved' : 'submit proof'}
					/>
				</ThemeProvider>
			</Claim>
		);
	};

	showClaims = ({ 0: tokenAddress, 1: tokenName, 2: tokenSymbol, 3: claimIds }) => {
		return (
			claimIds &&
			claimIds.map((claimId, index) => {
				return (
					<ContractData
						key={index}
						contractAddress={tokenAddress}
						method="getClaimInfo"
						methodArgs={[claimId]}
						callback={this.showClaim}
						callbackArgs={[tokenAddress, tokenName, tokenSymbol, claimId]}
					/>
				);
			})
		);
	};

	showClaimsByActionType = data => {
		return (
			data.length > 0 && (
				<Fin4Box title="My Previous Claims">
					{data.map((address, index) => {
						return (
							<ContractData key={index} contractAddress={address} method="getMyClaimIds" callback={this.showClaims} />
						);
					})}
				</Fin4Box>
			)
		);
	};

	render() {
		return (
			<ContractData
				contractName="Fin4Main"
				method="getActionsWhereUserHasClaims"
				callback={this.showClaimsByActionType}
			/>
		);
	}
}

const Claim = styled(Paper)`
	&& {
		box-sizing: border-box;
		margin-left: 0;
		margin-right: 0;
		background: ${props => (props.isapproved === 'true' ? `rgba(61, 219, 81, 0.15)` : `rgba(248, 57, 48, 0.15)`)};
	}
`;

const Currency = styled.span`
	text-transform: uppercase;
	border: 1px solid grey;
	border-radius: 4px;
	padding: 0 3px;
`;

export default PreviousClaims;
