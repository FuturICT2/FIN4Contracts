import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../ContractData';
// import { Fin4Box } from '../../Elements';
// import ContractData from '../../ContractData';
// import { Chip, Typography, Divider, Grid, Paper, createMuiTheme } from '@material-ui/core';
// import ThemeProvider from '@material-ui/styles/ThemeProvider';
// import colors from '../../config/colors-config';
// import DateIcon from '@material-ui/icons/AccessTime';
// import moment from 'moment';
// import styled from 'styled-components';

class PreviousClaims extends Component {
	constructor(props, context) {
		super(props);

		this.state = {
			claims: [],
			// drizzleState: context.drizzle.store.getState()
			contracts: context.drizzle.contracts
		};

		const claims = getContractData('Fin4Main', 'getActionsWhereUserHasClaims', [], context.drizzle)
			.then(actionTypeAddresses => {
				// console.log('action types addresses: ', actionTypeAddresses);
				return actionTypeAddresses.map(actionTypeAddress => {
					return getContractData(actionTypeAddress, 'getMyClaimIds', [], context.drizzle).then(
						({ 1: tokenName, 2: tokenSymbol, 3: claimIds }) => {
							// console.log('claim ids: ', claimIds);
							return claimIds.map(claimId => {
								return {
									id: `${actionTypeAddress}${claimId}`,
									claimId: claimId,
									actionTypeAddress: actionTypeAddress,
									actionTypeName: tokenName,
									actionTypeSymbol: tokenSymbol
								};
							});
							// let claims = this.state.claims.concat(newClaims);
							// var uniqueClaims = claims.filter((claim, index) => claims.map(claim => claim.id).indexOf(claim.id) >= index);
							// return uniqueClaims;
						}
					);
					// .then(claims => {
					// 	console.log(claims)
					// 	// return claims.map(claim => {
					// 	// 	return getContractData(claim.claimId, 'getClaimInfo', [claim.claimId], context.drizzle)
					// 	// 	// .then(data => {
					// 	// 	// 	console.log(data)
					// 	// 	// })
					// 	// })
					// 	// <ContractData
					// 	// 	key={index}
					// 	// 	contractAddress={tokenAddress}
					// 	// 	method="getClaimInfo"
					// 	// 	methodArgs={[claimId]}
					// 	// 	callback={this.showClaim}
					// 	// 	callbackArgs={[tokenAddress, tokenName, tokenSymbol, claimId]}
					// 	// />
					// });
				});
			})
			.then(data => Promise.all(data))
			.then(data => data.flat())
			.then(console.log);
		this.state.claim = claims;
	}

	// chipTheme = createMuiTheme({
	// 	palette: {
	// 		primary: {
	// 			main: colors.light,
	// 			contrastText: colors.main
	// 		},
	// 		secondary: {
	// 			main: 'rgba(248, 57, 48, 0.5)',
	// 			contrastText: colors.light
	// 		}
	// 	}
	// });
	// showClaim = (
	// 	{ 0: claimer, 1: isApproved, 2: quantity, 3: date, 4: comment },
	// 	[tokenAddress, tokenName, tokenSymbol, claimId]
	// ) => {
	// 	// crop last 3 digits (milliseconds) of date and apply human readable .calendar() function
	// 	date = moment.unix(Number(date.substring(0, date.length - 3))).calendar();
	// 	return (
	// 		<Claim isapproved={isApproved.toString()}>
	// 			<div>
	// 				<Grid container alignItems="center">
	// 					<Grid item xs>
	// 						<Typography gutterBottom variant="h5">
	// 							{tokenName}
	// 						</Typography>
	// 					</Grid>
	// 					<Grid item>
	// 						<Typography gutterBottom variant="h6">
	// 							{quantity} <Currency>{tokenSymbol}</Currency>
	// 						</Typography>
	// 					</Grid>
	// 				</Grid>
	// 				{comment && (
	// 					<Typography color="textSecondary" variant="body2">
	// 						{comment}
	// 					</Typography>
	// 				)}
	// 			</div>
	// 			<Divider style={{ margin: '10px 0' }} variant="middle" />
	// 			<ThemeProvider theme={this.chipTheme}>
	// 				<Chip key="0" color="primary" icon={<DateIcon />} label={date} style={{ marginRight: '20px' }} />
	// 				<Chip
	// 					key="1"
	// 					color={isApproved ? 'primary' : 'secondary'}
	// 					component={isApproved ? 'span' : 'a'}
	// 					clickable={!isApproved}
	// 					href={isApproved ? '' : `/proof?tokenAddress=${tokenAddress}&claimId=${claimId}`}
	// 					label={isApproved ? 'approved' : 'submit proof'}
	// 				/>
	// 			</ThemeProvider>
	// 		</Claim>
	// 	);
	// };

	// showClaims = ({ 0: tokenAddress, 1: tokenName, 2: tokenSymbol, 3: claimIds }) => {
	// 	return (
	// 		claimIds &&
	// 		claimIds.map((claimId, index) => {
	// 			return (
	// 				<ContractData
	// 					key={index}
	// 					contractAddress={tokenAddress}
	// 					method="getClaimInfo"
	// 					methodArgs={[claimId]}
	// 					callback={this.showClaim}
	// 					callbackArgs={[tokenAddress, tokenName, tokenSymbol, claimId]}
	// 				/>
	// 			);
	// 		})
	// 	);
	// };

	// showClaimsByActionType = data => {
	// 	return (
	// 		data.length > 0 && (
	// 			<Fin4Box title="My Previous Claims">
	// 				{data.map((address, index) => {
	// 					return (
	// 						<ContractData key={index} contractAddress={address} method="getMyClaimIds" callback={this.showClaims} />
	// 					);
	// 				})}
	// 			</Fin4Box>
	// 		)
	// 	);
	// };

	render() {
		return (
			// <ContractData
			// 	contractName="Fin4Main"
			// 	method="getActionsWhereUserHasClaims"
			// 	callback={this.showClaimsByActionType}
			// />
			<span>{JSON.stringify(this.state.claims)}</span>
		);
	}
}

// const Claim = styled(Paper)`
// 	&& {
// 		box-sizing: border-box;
// 		margin-left: 0;
// 		margin-right: 0;
// 		background: ${props => (props.isapproved === 'true' ? `rgba(61, 219, 81, 0.15)` : `rgba(248, 57, 48, 0.15)`)};
// 	}
// `;

PreviousClaims.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(PreviousClaims, mapStateToProps);

// export default PreviousClaims;
