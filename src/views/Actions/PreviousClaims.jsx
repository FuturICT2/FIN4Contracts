import React, { Component } from 'react';
import { Box } from '../../Elements';
import ContractData from '../../ContractData';

class PreviousClaims extends Component {
	showClaim = (
		{ 0: claimer, 1: isApproved, 2: quantity, 3: date, 4: comment },
		[tokenAddress, tokenName, tokenSymbol, claimId]
	) => {
		return (
			<li key={`${tokenAddress}-${claimId}`}>
				<font color="gray">{date}</font>&nbsp;
				<b>{tokenName}</b> [{tokenSymbol}] ({quantity}), {comment}
				{!isApproved && (
					<span>
						&nbsp;>> <a href={`/proof?tokenAddress=${tokenAddress}&claimId=${claimId}`}>submit proof</a>
					</span>
				)}
			</li>
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

	getActionsWhereUserHasClaims = data => {
		const claims =
			data &&
			data.map((address, index) => {
				return <ContractData key={index} contractAddress={address} method="getMyClaimIds" callback={this.showClaims} />;
			});
		return <ul>{claims}</ul>;
	};

	render() {
		return (
			<Box title="My Previous Claims">
				<ContractData
					contractName="Fin4Main"
					method="getActionsWhereUserHasClaims"
					callback={this.getActionsWhereUserHasClaims}
				/>
			</Box>
		);
	}
}

export default PreviousClaims;
