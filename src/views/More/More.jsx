import React from 'react';
import { Fin4Container, Fin4Card, Fin4Box, Fin4Table, Fin4TableRow } from '../../Elements';
import ContractData from '../../ContractData';
import styled from 'styled-components';
import dummyData from '../../config/dummy-data';

const showBalanceByActionType = data => {
	return (
		<Fin4Box title="My Action Tokens">
			<Fin4Table headers={['Name', 'Symbol', 'Balance']}>
				{data &&
					data.map((address, index) => {
						return (
							<ContractData
								key={index}
								contractAddress={address}
								method="getInfoAndBalance"
								callback={data => <Fin4TableRow data={data} />}
							/>
						);
					})}
			</Fin4Table>
		</Fin4Box>
	);
};

class More extends React.Component {
	render() {
		return (
			<Wrapper>
				<div>
					{dummyData.spendingOffers.map(({ title, imagePath, description, readMore }, index) => {
						return (
							<Fin4Card
								key={index}
								title={title}
								imagePath={imagePath}
								description={description}
								readMore={readMore}
								actionButtonText="redeem now"
							/>
						);
					})}
				</div>
				<Fin4Container>
					<ContractData contractName="Fin4Main" method="getChildren" callback={showBalanceByActionType} />
				</Fin4Container>
				<div>
					{dummyData.donationReceivers.map(({ title, imagePath, description, readMore }, index) => {
						return (
							<Fin4Card
								key={index}
								title={title}
								imagePath={imagePath}
								description={description}
								readMore={readMore}
								actionButtonText="donate"
							/>
						);
					})}
				</div>
			</Wrapper>
		);
	}
}

const Wrapper = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
`;

export default More;
