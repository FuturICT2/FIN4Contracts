import React, { Component } from 'react';
import { Box } from '../../Styles';
import ContractData from '../../ContractData';

class PreviousClaims extends Component {

	getClaimInfo = (data, info) => {
		var claimId = data[0];
		var isApproved = data[1];
		var quantity = data[2];
		var date = data[3];
		var comment = data[4];
		return (
			<li key={`${info.tokenAddress}-${info.claimId}`}>
				{info.tokenName} [{info.tokenSymbol}] ({quantity}),{' '}
				{!isApproved ? (
					<a href={`/proof?tokenAddress=${info.tokenAddress}&claimId=${info.claimId}`}>submit proof</a>
				) : (
					''
				)}
			</li>
		);
	}

	getMyClaimIds = data => {
		var tokenAddress = data[0];
		var tokenName = data[1];
		var tokenSymbol = data[2];
		var claimIds = data[3];
		return claimIds.map((claimId, index) => {
			return (
				<ContractData
					key={index}
					contractAddress={tokenAddress}
					method="getClaimInfo"
					methodArgs={[claimId]}
					callback={this.getClaimInfo}
					passToCallback={{
						tokenAddress: tokenAddress,
						tokenName: tokenName,
						tokenSymbol: tokenSymbol,
						claimId: claimId
					}}
				/>)
		});
	}

	getActionsWhereUserHasClaims = data => {
		const claims = data
			? data.map((address, index) => {
					return (
						<ContractData
							key={index}
							contractAddress={address}
							method="getMyClaimIds"
							callback={this.getMyClaimIds}
						/>
					);
			  })
			: [];
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
