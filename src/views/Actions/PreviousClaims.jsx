import React, { Component } from 'react';
import { Fin4Box, Fin4Table } from '../../Elements';
import ContractData from '../../ContractData';
import { TableCell, TableRow } from '@material-ui/core';
import moment from 'moment';

class PreviousClaims extends Component {
	showClaim = (
		{ 0: claimer, 1: isApproved, 2: quantity, 3: date, 4: comment },
		[tokenAddress, tokenName, tokenSymbol, claimId]
	) => {
		return (
			<TableRow>
				<TableCell key="0">{moment.unix(Number(date.substring(0, date.length - 3))).calendar()}</TableCell>
				<TableCell key="1">
					{tokenName} [{tokenSymbol}]
				</TableCell>
				<TableCell key="2">{quantity}</TableCell>
				<TableCell key="3">{comment}</TableCell>
				{!isApproved && (
					<TableCell key="4">
						<a href={`/proof?tokenAddress=${tokenAddress}&claimId=${claimId}`}>submit</a>
					</TableCell>
				)}
			</TableRow>
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
			<Fin4Table headers={['Date', 'Action', 'Quantity', 'Comment', 'Proof']} size="small">
				{data &&
					data.map((address, index) => {
						return (
							<ContractData key={index} contractAddress={address} method="getMyClaimIds" callback={this.showClaims} />
						);
					})}
			</Fin4Table>
		);
	};

	render() {
		return (
			<Fin4Box title="My Previous Claims">
				<ContractData
					contractName="Fin4Main"
					method="getActionsWhereUserHasClaims"
					callback={this.showClaimsByActionType}
				/>
			</Fin4Box>
		);
	}
}

export default PreviousClaims;
